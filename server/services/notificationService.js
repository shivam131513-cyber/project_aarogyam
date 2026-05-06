const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

/**
 * NotificationService — handles email, SMS, and in-app notifications
 * for the Aarogyam organ allocation system.
 */
class NotificationService {
  constructor() {
    // Email transporter (configure via env vars in production)
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    // Twilio client (optional — only if configured)
    this.twilioClient = null;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
      } catch {
        console.warn('⚠️ Twilio SDK not initialized — SMS disabled');
      }
    }

    // Notification templates
    this.templates = {
      organ_match: {
        subject: '🫀 Aarogyam — Potential Organ Match Found',
        body: (data) =>
          `Dear ${data.patientName},\n\nA potential ${data.organType} match has been identified. ` +
          `Match score: ${data.score}%.\n\nPlease contact your hospital immediately.\n\n` +
          `Hospital: ${data.hospitalName}\nContact: ${data.hospitalPhone}\n\n` +
          `— Aarogyam System`,
      },
      status_update: {
        subject: '📋 Aarogyam — Status Update',
        body: (data) =>
          `Dear ${data.recipientName},\n\n${data.message}\n\n` +
          `Updated at: ${new Date().toLocaleString('en-IN')}\n\n— Aarogyam System`,
      },
      emergency_alert: {
        subject: '🚨 URGENT — Aarogyam Emergency Alert',
        body: (data) =>
          `EMERGENCY ALERT\n\n${data.message}\n\n` +
          `Hospital: ${data.hospitalName}\nTime: ${new Date().toLocaleString('en-IN')}\n\n` +
          `Immediate action required.\n\n— Aarogyam System`,
      },
      allocation_result: {
        subject: '📊 Aarogyam — Allocation Decision',
        body: (data) =>
          `Dear ${data.recipientName},\n\nAn allocation decision has been made:\n\n` +
          `Organ: ${data.organType}\nPatient: ${data.patientName}\n` +
          `Score: ${data.score}%\nDecision: ${data.decision}\n\n` +
          `Full audit trail available on the transparency dashboard.\n\n— Aarogyam System`,
      },
    };
  }

  /**
   * Send an email notification.
   */
  async sendEmail(to, subject, body) {
    try {
      if (!process.env.SMTP_USER) {
        console.log(`📧 [Mock Email] To: ${to} | Subject: ${subject}`);
        return { success: true, mock: true };
      }

      const info = await this.emailTransporter.sendMail({
        from: `"Aarogyam System" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: body,
      });
      console.log(`📧 Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send an SMS notification via Twilio.
   */
  async sendSMS(phoneNumber, message) {
    try {
      if (!this.twilioClient) {
        console.log(`📱 [Mock SMS] To: ${phoneNumber} | Message: ${message.substring(0, 50)}...`);
        return { success: true, mock: true };
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log(`📱 SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ SMS send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create an in-app notification stored in the database.
   */
  async sendInAppNotification({ recipientId, recipientType, type, title, message, priority, relatedEntity, metadata }) {
    try {
      const notification = new Notification({
        recipientId,
        recipientType: recipientType || 'patient',
        type: type || 'system_notification',
        title,
        message,
        priority: priority || 'medium',
        channels: { inApp: true },
        deliveryStatus: { inApp: 'delivered' },
        relatedEntity,
        metadata,
      });
      await notification.save();
      console.log(`🔔 In-app notification created for ${recipientId}`);
      return { success: true, notificationId: notification._id };
    } catch (error) {
      console.error('❌ In-app notification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notify about a potential organ match — sends via all channels.
   */
  async notifyOrganMatch({ patientId, patientName, patientEmail, patientPhone, organType, score, hospitalName, hospitalPhone }) {
    const template = this.templates.organ_match;
    const body = template.body({ patientName, organType, score, hospitalName, hospitalPhone });

    const results = await Promise.allSettled([
      this.sendInAppNotification({
        recipientId: patientId,
        recipientType: 'patient',
        type: 'organ_match',
        title: template.subject,
        message: body,
        priority: 'critical',
        relatedEntity: { entityType: 'organ', entityId: organType },
      }),
      patientEmail ? this.sendEmail(patientEmail, template.subject, body) : Promise.resolve({ skipped: true }),
      patientPhone ? this.sendSMS(patientPhone, `Aarogyam: Potential ${organType} match found! Score: ${score}%. Contact ${hospitalName} immediately.`) : Promise.resolve({ skipped: true }),
    ]);

    return {
      inApp: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
      email: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
      sms: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason },
    };
  }

  /**
   * Send emergency alert to all relevant parties.
   */
  async notifyEmergency({ hospitalId, hospitalName, message, recipients }) {
    const template = this.templates.emergency_alert;
    const body = template.body({ message, hospitalName });

    const results = [];
    for (const recipient of recipients) {
      const result = await this.sendInAppNotification({
        recipientId: recipient.id,
        recipientType: recipient.type,
        type: 'emergency_alert',
        title: template.subject,
        message: body,
        priority: 'critical',
        relatedEntity: { entityType: 'hospital', entityId: hospitalId },
      });
      results.push(result);
    }
    return results;
  }

  /**
   * Get notifications for a user.
   */
  async getNotifications(recipientId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const query = { recipientId };
    if (unreadOnly) query.isRead = false;

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });

    return { notifications, total, unreadCount, page, limit };
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(notificationId) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(recipientId) {
    return Notification.updateMany(
      { recipientId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }
}

module.exports = new NotificationService();
