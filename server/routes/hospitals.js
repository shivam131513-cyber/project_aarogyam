const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// GET /api/hospitals — list all hospitals with filtering
router.get('/', async (req, res) => {
  try {
    const { region, status = 'active', transplantCapable, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (region) query.region = region;
    if (status) query.status = status;
    if (transplantCapable === 'true') query.transplantCapable = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    const [hospitals, total] = await Promise.all([
      Hospital.find(query).sort({ name: 1 })
        .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).lean(),
      Hospital.countDocuments(query),
    ]);

    res.json({ success: true, hospitals, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    // Demo fallback
    res.json({
      success: true, _demo: true,
      hospitals: [
        { _id: 'H001', name: 'AIIMS New Delhi', code: 'AIIMS_DEL', region: 'Delhi NCR', type: 'government', transplantCapable: true, status: 'active', metrics: { totalTransplants: 245, successRate: 94, activePatients: 156 } },
        { _id: 'H002', name: 'Tata Memorial Hospital', code: 'TMH_MUM', region: 'Mumbai', type: 'trust', transplantCapable: true, status: 'active', metrics: { totalTransplants: 189, successRate: 91, activePatients: 123 } },
        { _id: 'H003', name: 'CMC Vellore', code: 'CMC_VEL', region: 'Chennai', type: 'trust', transplantCapable: true, status: 'active', metrics: { totalTransplants: 210, successRate: 93, activePatients: 145 } },
        { _id: 'H004', name: 'PGIMER Chandigarh', code: 'PGI_CHD', region: 'Chandigarh', type: 'government', transplantCapable: true, status: 'active', metrics: { totalTransplants: 178, successRate: 90, activePatients: 112 } },
        { _id: 'H005', name: 'SSKM Hospital Kolkata', code: 'SSKM_KOL', region: 'Kolkata', type: 'government', transplantCapable: true, status: 'active', metrics: { totalTransplants: 134, successRate: 88, activePatients: 98 } },
      ],
      pagination: { total: 5, page: 1, limit: 20, totalPages: 1 },
    });
  }
});

// GET /api/hospitals/nearby — find nearby hospitals
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radiusKm = 50 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'lat and lng are required' });
    }
    const hospitals = await Hospital.find({
      status: 'active',
      transplantCapable: true,
    }).lean();

    // Simple distance calculation (Haversine)
    const toRad = (deg) => deg * Math.PI / 180;
    const haversine = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const nearby = hospitals
      .filter(h => h.coordinates && h.coordinates.lat && h.coordinates.lng)
      .map(h => ({ ...h, distance: haversine(parseFloat(lat), parseFloat(lng), h.coordinates.lat, h.coordinates.lng) }))
      .filter(h => h.distance <= parseFloat(radiusKm))
      .sort((a, b) => a.distance - b.distance);

    res.json({ success: true, hospitals: nearby, total: nearby.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/hospitals/:id — hospital details
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).lean();
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/hospitals/:id/stats — hospital-specific stats
router.get('/:id/stats', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select('name code metrics').lean();
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
    res.json({ success: true, hospital: hospital.name, stats: hospital.metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
