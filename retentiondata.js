const mongoose = require('mongoose');

const retentionDataSchema = new mongoose.Schema({
  // Employee Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added unique constraint
  phone: String,

  // Employment Dates
  last_hire_date: String,
  job_start: String,
  termination_date: String,
  original_hire: String,  // Added based on your code
  seniority_date: String, // Added based on your code
  
  // Employment Details
  termination_reason: String,
  employement_status: { type: String, required: true },
  job_title: String,
  department: String,
  facility: String,

  // Personal Information
  date_of_birth: String,

  // Engagement Scores - Updated to match your actual data structure
  categoryScores: {
    'schedule & workload': { type: Number, default: 0 },
    'money & compensation': { type: Number, default: 0 },
    'job satisfaction': { type: Number, default: 0 },
    'family & work-life balance': { type: Number, default: 0 },
    'communication & leadership': { type: Number, default: 0 },
    'lack of rest': { type: Number, default: 0 }
  },
  
  // OR if you prefer flexible structure, use this instead:
  // categoryScores: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  overallScore: { type: Number, required: true, default: 0 },

  // Calculated Fields
  riskLevel: { type: String, default: 'Low' },
  improvementArea: String,
  possibleImprovedScore: { type: Number, default: 0 }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  strict: false // This allows extra fields not defined in schema
});

// Add indexes for better performance
retentionDataSchema.index({ email: 1 });
retentionDataSchema.index({ name: 1 });
retentionDataSchema.index({ overallScore: 1 });

const RetentionData = mongoose.model('RetentionData', retentionDataSchema);

module.exports = RetentionData;