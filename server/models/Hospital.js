const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  type: {
    type: String,
    enum: ['government', 'private', 'trust', 'military'],
    default: 'government',
  },

  // Location
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    district: String,
  },
  region: { type: String, required: true, index: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  // Contact Information
  contact: {
    phone: { type: String, required: true },
    emergencyPhone: String,
    email: { type: String, required: true },
    website: String,
  },

  // Capacity & Capabilities
  totalBeds: { type: Number, default: 0 },
  icuBeds: { type: Number, default: 0 },
  transplantCapable: { type: Boolean, default: false },
  supportedOrgans: [{
    type: String,
    enum: ['heart', 'kidney', 'liver', 'lung', 'pancreas', 'intestine'],
  }],
  hasBloodBank: { type: Boolean, default: false },
  hasICU: { type: Boolean, default: true },

  // Staff
  totalDoctors: { type: Number, default: 0 },
  transplantSurgeons: { type: Number, default: 0 },

  // Registration & Compliance
  nottoRegistrationId: { type: String, sparse: true },
  nabhlAccredited: { type: Boolean, default: false },
  licenseNumber: { type: String },
  licenseExpiry: { type: Date },

  // Performance Metrics
  metrics: {
    totalTransplants: { type: Number, default: 0 },
    successRate: { type: Number, default: 0, min: 0, max: 100 },
    averageResponseTime: { type: Number, default: 0 }, // in minutes
    activePatients: { type: Number, default: 0 },
    fairnessScore: { type: Number, default: 0, min: 0, max: 100 },
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'under_review'],
    default: 'active',
    index: true,
  },
  isVerified: { type: Boolean, default: false },

  // Integration
  ayushmanEmpanelled: { type: Boolean, default: false },
  rfidEnabled: { type: Boolean, default: false },
  cvEnabled: { type: Boolean, default: false },
}, {
  timestamps: true,
});

hospitalSchema.index({ region: 1, status: 1 });
hospitalSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
