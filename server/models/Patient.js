const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Personal Information
  name: {
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true },
  },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
  },

  // Government IDs
  abhaId: { type: String, unique: true, sparse: true, index: true },
  aadhaarHash: { type: String }, // hashed for privacy

  // Medical Information
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  organNeeded: {
    type: String,
    enum: ['heart', 'kidney', 'liver', 'lung', 'pancreas', 'intestine'],
    required: true,
  },
  urgencyScore: { type: Number, min: 0, max: 100, default: 50 },
  urgencyLevel: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium',
  },
  medicalHistory: { type: String },
  currentDiagnosis: { type: String },
  vitalSigns: {
    heartRate: Number,
    bloodPressure: String,
    oxygenSaturation: Number,
    temperature: Number,
  },

  // Hospital Association
  hospitalId: { type: String, index: true },
  hospitalName: { type: String },
  attendingDoctor: { type: String },

  // Organ Waiting List
  registrationDate: { type: Date, default: Date.now },
  waitingListPosition: { type: Number },
  status: {
    type: String,
    enum: ['waiting', 'matched', 'transplanted', 'inactive', 'deceased'],
    default: 'waiting',
    index: true,
  },

  // Attendance / Presence
  isPresent: { type: Boolean, default: false },
  lastSeenAt: { type: Date },
  lastSeenLocation: { type: String },

  // Region for allocation proximity
  region: { type: String, index: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },

  // Insurance
  ayushmanBeneficiary: { type: Boolean, default: false },
  insuranceProvider: String,
  insurancePolicyNumber: String,

  // Allocation history (references)
  allocationHistory: [{
    organId: String,
    allocatedAt: Date,
    score: Number,
    outcome: { type: String, enum: ['successful', 'rejected', 'expired', 'pending'] },
  }],

  // RFID tag (for hospital attendance tracking)
  rfidTag: { type: String, sparse: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// Index for efficient querying
patientSchema.index({ organNeeded: 1, urgencyScore: -1, status: 1 });
patientSchema.index({ region: 1, organNeeded: 1 });

module.exports = mongoose.model('Patient', patientSchema);
