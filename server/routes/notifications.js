const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

// GET /api/notifications — get notifications for a user
router.get('/', async (req, res) => {
  try {
    const { recipientId, page = 1, limit = 20, unreadOnly } = req.query;
    if (!recipientId) {
      return res.status(400).json({ success: false, error: 'recipientId is required' });
    }
    const result = await notificationService.getNotifications(recipientId, {
      page: parseInt(page), limit: parseInt(limit), unreadOnly: unreadOnly === 'true',
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notifications/:id/read — mark a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notifications/read-all — mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ success: false, error: 'recipientId is required' });
    }
    const result = await notificationService.markAllAsRead(recipientId);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notifications/send — send a notification (admin)
router.post('/send', async (req, res) => {
  try {
    const { recipientId, recipientType, type, title, message, priority } = req.body;
    if (!recipientId || !title || !message) {
      return res.status(400).json({ success: false, error: 'recipientId, title, and message are required' });
    }
    const result = await notificationService.sendInAppNotification({
      recipientId, recipientType, type, title, message, priority,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
