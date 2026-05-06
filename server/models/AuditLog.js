const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // What action was performed
  action: {
    type: String,
    required: true,
    enum: [
      'allocation_decision',
      'patient_registered',
      'patient_updated',
      'organ_registered',
      'organ_status_changed',
      'doctor_login',
      'doctor_logout',
      'system_config_change',
      'report_generated',
      'emergency_declared',
      'manual_override',
      'data_export',
      'data_access',
    ],
    index: true,
  },

  // Who performed the action
  actor: {
    userId: { type: String, required: true, index: true },
    userType: { type: String, enum: ['doctor', 'admin', 'system', 'patient'], required: true },
    userName: { type: String },
    hospitalId: { type: String },
    ipAddress: { type: String },
  },

  // What entity was affected
  entity: {
    entityType: { type: String, enum: ['patient', 'organ', 'allocation', 'hospital', 'system'], required: true },
    entityId: { type: String },
    entityName: { type: String },
  },

  // Details of the action
  details: {
    description: { type: String, required: true },
    previousState: { type: mongoose.Schema.Types.Mixed },
    newState: { type: mongoose.Schema.Types.Mixed },
    reason: { type: String },
    allocationScore: { type: Number },
    biasCheckResult: {
      passed: Boolean,
      flags: [String],
    },
  },

  // Compliance
  complianceFlags: [{
    type: String,
    enum: ['hipaa', 'gdpr', 'indian_healthcare', 'notto', 'data_protection'],
  }],
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  },

  // Result
  outcome: {
    type: String,
    enum: ['success', 'failure', 'partial', 'pending'],
    default: 'success',
  },
}, {
  timestamps: true,
});

// Compound index for efficient querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ 'actor.userId': 1, createdAt: -1 });
auditLogSchema.index({ 'entity.entityType': 1, 'entity.entityId': 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
