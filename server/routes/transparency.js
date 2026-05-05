const express = require('express');
const router = express.Router();
const transparencyService = require('../services/transparencyService');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for transparency endpoints
const transparencyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests to transparency API'
});

router.use(transparencyLimiter);

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/transparency/dashboard - Public transparency dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const transparencyData = await transparencyService.getDashboardData();

    res.json({
      success: true,
      message: 'Public transparency dashboard data',
      data: transparencyData,
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });

  } catch (error) {
    console.error('Transparency dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load transparency dashboard',
      message: error.message
    });
  }
});

// GET /api/transparency/hospital-stats - Hospital-specific public stats
router.get('/hospital-stats', [
  query('region').optional().isString().trim(),
  query('hospitalType').optional().isIn(['Government', 'Private', 'Trust/NGO']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { region, hospitalType } = req.query;
    const filters = {};
    
    if (region) filters.region = region;
    if (hospitalType) filters.hospitalType = hospitalType;

    const hospitalStats = await transparencyService.getHospitalStats(filters);

    res.json({
      success: true,
      data: hospitalStats,
      filters: { region, hospitalType },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Hospital stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load hospital statistics',
      message: error.message
    });
  }
});

// GET /api/transparency/real-time-feed - Public real-time activity feed
router.get('/real-time-feed', [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type').optional().isIn(['allocation', 'detection', 'attendance', 'alert', 'system']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { limit = 50, type } = req.query;

    const activities = await transparencyService.getRealTimeFeed(limit, type);

    res.json({
      success: true,
      activities,
      totalCount: activities.length,
      filters: { limit, type },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Real-time feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load real-time feed',
      message: error.message
    });
  }
});

// POST /api/transparency/activity - Log new activity (internal use)
router.post('/activity', [
  body('type').isIn(['allocation', 'detection', 'attendance', 'alert', 'system']),
  body('region').isString().trim().isLength({ min: 1, max: 100 }),
  body('message').isString().trim().isLength({ min: 1, max: 500 }),
  body('hospitalId').optional().isString().trim(),
  body('metadata').optional().isObject(),
  body('isPublic').optional().isBoolean(),
  handleValidationErrors
], async (req, res) => {
  try {
    const activityData = req.body;
    const activity = await transparencyService.logActivity(activityData);

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activity,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log activity',
      message: error.message
    });
  }
});

// PUT /api/transparency/hospital/:hospitalId/stats - Update hospital statistics (internal use)
router.put('/hospital/:hospitalId/stats', [
  body('hospitalName').optional().isString().trim(),
  body('region').optional().isString().trim(),
  body('hospitalType').optional().isIn(['Government', 'Private', 'Trust/NGO']),
  body('stats').optional().isObject(),
  body('technology').optional().isObject(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const statsUpdate = req.body;

    const hospital = await transparencyService.updateHospitalStats(hospitalId, statsUpdate);

    res.json({
      success: true,
      message: 'Hospital statistics updated successfully',
      data: hospital,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Hospital stats update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hospital statistics',
      message: error.message
    });
  }
});

// PUT /api/transparency/system-metrics - Update system metrics (internal use)
router.put('/system-metrics', [
  body('systemStats').optional().isObject(),
  body('organAllocation').optional().isObject(),
  body('equityMetrics').optional().isObject(),
  body('governmentIntegration').optional().isObject(),
  handleValidationErrors
], async (req, res) => {
  try {
    const metricsData = req.body;
    const metrics = await transparencyService.updateSystemMetrics(metricsData);

    res.json({
      success: true,
      message: 'System metrics updated successfully',
      data: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('System metrics update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update system metrics',
      message: error.message
    });
  }
});

module.exports = router;
