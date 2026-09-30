const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { Contact } = require('../models/index');
const auth = require('../middleware/auth');
const { sendContactConfirmation, sendAdminContactNotification } = require('../utils/email');

// POST /api/contact
router.post('/', [
  body('name').trim().isLength({ min: 2 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min: 3 }).escape(),
  body('message').trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = new Contact(req.body);
    await contact.save();

    // Send emails
    try {
      await sendContactConfirmation(req.body.email, req.body.name, req.body.subject);
      await sendAdminContactNotification(req.body);
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Message sent! I will reply within 24 hours.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/contact (admin)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/contact/:id/read (admin)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
