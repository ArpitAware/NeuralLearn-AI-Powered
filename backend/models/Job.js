const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    description: { type: String, required: true },
    requirements: [String],
    tags: [String],
    applyUrl: { type: String },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
