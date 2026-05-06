const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

// GET /api/analytics/dashboard — system-wide analytics summary
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await analyticsService.getAllocationStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/fairness — gender parity and fairness metrics
router.get('/fairness', async (req, res) => {
  try {
    const metrics = await analyticsService.getGenderParityMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/regional — regional performance analytics
router.get('/regional', async (req, res) => {
  try {
    const data = await analyticsService.getRegionalAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/trends — time-series allocation trends
router.get('/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const data = await analyticsService.getTrends(parseInt(days));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/health — system health metrics
router.get('/health', async (req, res) => {
  try {
    const health = await analyticsService.getSystemHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
