const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Request = require('../models/Request');
const { Contact, Testimonial, Blog, Service } = require('../models/index');

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      totalRequests,
      newRequests,
      activeRequests,
      completedRequests,
      totalMessages,
      unreadMessages,
      totalTestimonials,
      totalBlogs
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Request.countDocuments(),
      Request.countDocuments({ status: 'Request Received' }),
      Request.countDocuments({ status: { $in: ['Discussion', 'Approved', 'Development', 'Testing'] } }),
      Request.countDocuments({ status: 'Completed' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Testimonial.countDocuments(),
      Blog.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        totalProjects,
        publishedProjects,
        totalRequests,
        newRequests,
        activeRequests,
        completedRequests,
        totalMessages,
        unreadMessages,
        totalTestimonials,
        totalBlogs
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/recent-activity
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const [recentRequests, recentMessages] = await Promise.all([
      Request.find().sort({ createdAt: -1 }).limit(5).select('requestId name projectType status createdAt'),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name subject isRead createdAt')
    ]);
    res.json({ success: true, recentRequests, recentMessages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
