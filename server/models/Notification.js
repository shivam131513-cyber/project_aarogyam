const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  recipientId: { type: String, required: true, index: true },
  recipientType: {
    type: String,
    enum: ['patient', 'doctor', 'hospital', 'admin'],
    required: true,
  },

  // Notification Content
  type: {
    type: String,
    enum: [
      'organ_match',
      'status_update',
      'emergency_alert',
      'system_notification',
      'allocation_result',
      'appointment_reminder',
      'compliance_alert',
    ],
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },

  // Delivery Channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
  },
  deliveryStatus: {
    inApp: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
    email: { type: String, enum: ['pending', 'delivered', 'failed', 'not_sent'], default: 'not_sent' },
    sms: { type: String, enum: ['pending', 'delivered', 'failed', 'not_sent'], default: 'not_sent' },
  },

  // Read Status
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date },

  // Reference to related entity
  relatedEntity: {
    entityType: { type: String, enum: ['organ', 'patient', 'allocation', 'hospital'] },
    entityId: { type: String },
  },

  // Metadata
  metadata: { type: mongoose.Schema.Types.Mixed },
  expiresAt: { type: Date },
}, {
  timestamps: true,
});

// TTL index — auto-delete old notifications after 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
