const mongoose = require('mongoose');

// Viability windows in hours
const VIABILITY_HOURS = {
  heart: 6,
  lung: 8,
  liver: 12,
  pancreas: 18,
  kidney: 36,
  intestine: 12,
};

const organSchema = new mongoose.Schema({
  // Organ Information
  type: {
    type: String,
    enum: ['heart', 'kidney', 'liver', 'lung', 'pancreas', 'intestine'],
    required: true,
    index: true,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  hlaType: { type: String }, // Human Leukocyte Antigen type

  // Donor Information (anonymized)
  donorId: { type: String, required: true },
  donorAge: { type: Number },
  donorGender: { type: String, enum: ['male', 'female', 'other'] },
  donorBloodType: { type: String },
  donationType: {
    type: String,
    enum: ['deceased', 'living'],
    required: true,
  },

  // Source Hospital
  sourceHospitalId: { type: String, required: true, index: true },
  sourceHospitalName: { type: String, required: true },
  sourceRegion: { type: String },
  sourceCoordinates: {
    lat: Number,
    lng: Number,
  },

  // Viability Tracking
  harvestTime: { type: Date, required: true },
  viabilityWindowHours: { type: Number },
  expiresAt: { type: Date, index: true },

  // Quality & Condition
  qualityScore: { type: Number, min: 0, max: 100 },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good',
  },
  preservationMethod: { type: String },
  temperature: { type: Number }, // storage temperature in Celsius

  // Status
  status: {
    type: String,
    enum: ['available', 'allocated', 'in_transit', 'transplanted', 'expired', 'discarded'],
    default: 'available',
    index: true,
  },

  // Allocation Details
  allocatedToPatientId: { type: String },
  allocatedToHospitalId: { type: String },
  allocatedAt: { type: Date },
  allocationScore: { type: Number },

  // Transport
  transportMethod: { type: String, enum: ['ground', 'air', 'green_corridor'] },
  estimatedTransitTime: { type: Number }, // in minutes
  currentLocation: { type: String },

  // Metadata
  registeredBy: { type: String },
  notes: { type: String },
}, {
  timestamps: true,
});

// Pre-save: auto-calculate viability window and expiry
organSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('harvestTime') || this.isModified('type')) {
    this.viabilityWindowHours = VIABILITY_HOURS[this.type] || 12;
    this.expiresAt = new Date(
      this.harvestTime.getTime() + this.viabilityWindowHours * 60 * 60 * 1000
    );
  }
  next();
});

// Virtual: remaining viability in hours
organSchema.virtual('remainingHours').get(function () {
  if (!this.expiresAt) return 0;
  const remaining = (this.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return Math.max(0, Math.round(remaining * 10) / 10);
});

// Virtual: is still viable
organSchema.virtual('isViable').get(function () {
  return this.expiresAt && this.expiresAt > new Date() && this.status === 'available';
});

organSchema.set('toJSON', { virtuals: true });
organSchema.set('toObject', { virtuals: true });

organSchema.index({ type: 1, status: 1, bloodType: 1 });

organSchema.statics.VIABILITY_HOURS = VIABILITY_HOURS;

module.exports = mongoose.model('Organ', organSchema);
