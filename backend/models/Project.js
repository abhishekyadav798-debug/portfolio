const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: {
    type: String,
    enum: ['Web', 'AI/ML', 'Full Stack', 'Software', 'Hackathon'],
    required: true
  },
  technologies: [{ type: String }],
  images: [{ type: String }],
  thumbnail: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
  problem: { type: String },
  solution: { type: String },
  features: [{ type: String }],
  contribution: { type: String },
  challenges: { type: String },
  results: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
