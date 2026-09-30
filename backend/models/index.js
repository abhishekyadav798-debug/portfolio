const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date }
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  designation: { type: String },
  company: { type: String },
  project: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  profileImage: { type: String },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  thumbnail: { type: String },
  category: {
    type: String,
    enum: ['Web Development', 'AI/ML', 'Software Engineering', 'Tutorials', 'Case Studies', 'Technology'],
    required: true
  },
  tags: [{ type: String }],
  readingTime: { type: Number },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String },
  description: { type: String, required: true },
  features: [{ type: String }],
  startingPrice: { type: String },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Contact: mongoose.model('Contact', contactSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Service: mongoose.model('Service', serviceSchema)
};
