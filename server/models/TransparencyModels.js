const mongoose = require('mongoose');

// Hospital Statistics Schema
const HospitalStatsSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true,
    unique: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  hospitalType: {
    type: String,
    enum: ['Government', 'Private', 'Trust/NGO'],
    required: true
  },
  stats: {
    totalPatients: { type: Number, default: 0 },
    activePatients: { type: Number, default: 0 },
    successfulTransplants: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 }, // in days
    attendanceRate: { type: Number, default: 0 }
  },
  technology: {
    rfidEnabled: { type: Boolean, default: false },
    computerVisionEnabled: { type: Boolean, default: false },
    aiIntegrated: { type: Boolean, default: false },
    rfidReaders: { type: Number, default: 0 },
    cameras: { type: Number, default: 0 }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Real-time Activity Schema
const ActivitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['allocation', 'detection', 'attendance', 'alert', 'system'],
    required: true
  },
  hospitalId: String,
  region: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    urgencyScore: Number,
    confidence: Number,
    processingTime: String,
    accuracy: Number,
    patientsDetected: Number,
    recordsProcessed: Number,
    responseTime: String,
    urgencyLevel: String,
    priority: Number,
    uptime: String,
    performance: String,
    status: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// System Metrics Schema
const SystemMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  systemStats: {
    totalHospitals: { type: Number, default: 0 },
    activeHospitals: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    successfulTransplants: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 }
  },
  realTimeMetrics: {
    patientsPresent: { type: Number, default: 0 },
    patientsAbsent: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0 },
    rfidActiveReaders: { type: Number, default: 0 },
    computerVisionCameras: { type: Number, default: 0 },
    detectionAccuracy: { type: Number, default: 0 }
  },
  organAllocation: {
    heart: {
      available: { type: Number, default: 0 },
      allocated: { type: Number, default: 0 },
      inTransit: { type: Number, default: 0 },
      avgAllocationTime: { type: Number, default: 0 } // in hours
    },
    kidney: {
      available: { type: Number, default: 0 },
      allocated: { type: Number, default: 0 },
      inTransit: { type: Number, default: 0 },
      avgAllocationTime: { type: Number, default: 0 }
    },
    liver: {
      available: { type: Number, default: 0 },
      allocated: { type: Number, default: 0 },
      inTransit: { type: Number, default: 0 },
      avgAllocationTime: { type: Number, default: 0 }
    }
  },
  equityMetrics: {
    genderDistribution: {
      maleRecipients: { type: Number, default: 0 },
      femaleRecipients: { type: Number, default: 0 },
      improvement: String
    },
    geographicEquity: {
      ruralPatients: { type: Number, default: 0 },
      urbanPatients: { type: Number, default: 0 },
      ruralSuccessRate: { type: Number, default: 0 },
      urbanSuccessRate: { type: Number, default: 0 }
    },
    economicEquity: {
      publicHospitals: { type: Number, default: 0 },
      privateHospitals: { type: Number, default: 0 },
      avgWaitTimePublic: { type: Number, default: 0 },
      avgWaitTimePrivate: { type: Number, default: 0 }
    }
  },
  governmentIntegration: {
    abhaVerifications: { type: Number, default: 0 },
    notoConnectivity: { type: String, default: 'Active' },
    ayushmanBharatClaims: { type: Number, default: 0 },
    complianceScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Regional Statistics Schema
const RegionalStatsSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    unique: true
  },
  hospitals: { type: Number, default: 0 },
  patients: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 0 },
  avgResponseTime: { type: Number, default: 0 }, // in minutes
  successRate: { type: Number, default: 0 },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Technology Metrics Schema
const TechnologyMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  rfidSystem: {
    totalReaders: { type: Number, default: 0 },
    onlineReaders: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 },
    avgBatteryLevel: { type: Number, default: 0 }
  },
  computerVision: {
    totalCameras: { type: Number, default: 0 },
    activeCameras: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 },
    avgConfidence: { type: Number, default: 0 },
    detectionsToday: { type: Number, default: 0 }
  },
  aiAllocation: {
    algorithmsActive: { type: Number, default: 0 },
    decisionsToday: { type: Number, default: 0 },
    avgProcessingTime: { type: Number, default: 0 }, // in seconds
    biasReductionScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Create indexes for better performance
HospitalStatsSchema.index({ region: 1, hospitalType: 1 });
ActivitySchema.index({ type: 1, timestamp: -1 });
ActivitySchema.index({ region: 1, timestamp: -1 });
SystemMetricsSchema.index({ date: -1 });
// RegionalStatsSchema already has unique index on region field, no need for manual index
TechnologyMetricsSchema.index({ date: -1 });

// Create models
const HospitalStats = mongoose.model('HospitalStats', HospitalStatsSchema);
const Activity = mongoose.model('Activity', ActivitySchema);
const SystemMetrics = mongoose.model('SystemMetrics', SystemMetricsSchema);
const RegionalStats = mongoose.model('RegionalStats', RegionalStatsSchema);
const TechnologyMetrics = mongoose.model('TechnologyMetrics', TechnologyMetricsSchema);

module.exports = {
  HospitalStats,
  Activity,
  SystemMetrics,
  RegionalStats,
  TechnologyMetrics
};
