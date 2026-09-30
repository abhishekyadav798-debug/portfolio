const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  projectType: {
    type: String,
    enum: ['Website', 'Web Application', 'AI/ML', 'E-commerce', 'Portfolio', 'Business Website', 'College Project', 'Bug Fix', 'Custom Software', 'Other'],
    required: true
  },
  budget: {
    type: String,
    enum: ['Under ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+'],
    required: true
  },
  deadline: { type: String },
  description: { type: String, required: true },
  features: { type: String },
  referenceWebsite: { type: String },
  files: [{ type: String }],
  preferredContact: {
    type: String,
    enum: ['Email', 'WhatsApp', 'Phone'],
    default: 'Email'
  },
  status: {
    type: String,
    enum: ['Request Received', 'Requirement Review', 'Discussion', 'Quotation', 'Approved', 'Development', 'Testing', 'Completed', 'Cancelled'],
    default: 'Request Received'
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  quotation: {
    amount: Number,
    currency: { type: String, default: '₹' },
    description: String,
    validUntil: Date
  },
  timeline: {
    estimatedStartDate: Date,
    estimatedEndDate: Date,
    actualStartDate: Date,
    actualEndDate: Date
  },
  messages: [{
    sender: { type: String, enum: ['admin', 'client'] },
    message: String,
    sentAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  deliverables: [{ url: String, name: String, uploadedAt: Date }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
