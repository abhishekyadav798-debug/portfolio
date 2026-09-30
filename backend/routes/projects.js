const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects (admin)
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
