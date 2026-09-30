const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const { sendRequestConfirmation, sendAdminNotification } = require('../utils/email');

// Generate unique request ID
function generateRequestId() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `REQ-${year}-${random}`;
}

// POST /api/requests - Submit new project request
router.post('/', [
  body('name').trim().isLength({ min: 2 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('projectType').notEmpty(),
  body('budget').notEmpty(),
  body('description').trim().isLength({ min: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const requestId = generateRequestId();
    const request = new Request({
      ...req.body,
      requestId,
      statusHistory: [{ status: 'Request Received', note: 'Project request submitted' }]
    });

    await request.save();

    // Send emails
    try {
      await sendRequestConfirmation(req.body.email, req.body.name, requestId);
      await sendAdminNotification(req.body, requestId);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      requestId,
      message: 'Project request submitted successfully!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// GET /api/requests/track?requestId=...&email=...
router.get('/track', async (req, res) => {
  try {
    const { requestId, email } = req.query;
    if (!requestId || !email) {
      return res.status(400).json({ error: 'Request ID and email are required' });
    }

    const request = await Request.findOne({ requestId, email: email.toLowerCase() })
      .select('-notes -messages');

    if (!request) {
      return res.status(404).json({ error: 'Request not found. Please check your Request ID and email.' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track request' });
  }
});

// GET /api/requests/:requestId/dashboard - Client dashboard
router.get('/:requestId/dashboard', async (req, res) => {
  try {
    const { email } = req.query;
    const request = await Request.findOne({ requestId: req.params.requestId, email: email?.toLowerCase() });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/requests/:requestId/message - Client sends message
router.post('/:requestId/message', [
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const { email, message } = req.body;
    const request = await Request.findOne({ requestId: req.params.requestId, email: email?.toLowerCase() });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.messages.push({ sender: 'client', message });
    await request.save();
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- ADMIN ROUTES ----

// GET /api/requests (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Request.countDocuments(query);
    res.json({ success: true, requests, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests/:id (admin - single)
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/requests/:id/status (admin)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Not found' });

    request.status = status;
    request.statusHistory.push({ status, note: note || '' });
    await request.save();

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/requests/:id/message (admin reply)
router.post('/:id/admin-message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Not found' });

    request.messages.push({ sender: 'admin', message });
    await request.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/requests/:id/quotation (admin)
router.patch('/:id/quotation', auth, async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { quotation: req.body },
      { new: true }
    );
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
