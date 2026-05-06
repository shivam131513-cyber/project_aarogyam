const express = require('express');
const router = express.Router();
const Organ = require('../models/Organ');
const auditService = require('../services/auditService');

// GET /api/organs — list available organs with filtering
router.get('/', async (req, res) => {
  try {
    const { type, bloodType, status = 'available', page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (bloodType) query.bloodType = bloodType;
    if (status) query.status = status;

    const [organs, total] = await Promise.all([
      Organ.find(query).sort({ expiresAt: 1 })
        .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).lean(),
      Organ.countDocuments(query),
    ]);

    res.json({ success: true, organs, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    // Demo fallback
    res.json({
      success: true, _demo: true,
      organs: [
        { _id: 'ORG001', type: 'kidney', bloodType: 'A+', status: 'available', qualityScore: 92, sourceHospitalName: 'AIIMS Delhi', remainingHours: 28.5 },
        { _id: 'ORG002', type: 'liver', bloodType: 'O+', status: 'available', qualityScore: 88, sourceHospitalName: 'Tata Memorial', remainingHours: 8.2 },
        { _id: 'ORG003', type: 'heart', bloodType: 'B+', status: 'in_transit', qualityScore: 95, sourceHospitalName: 'CMC Vellore', remainingHours: 3.1 },
      ],
      pagination: { total: 3, page: 1, limit: 20, totalPages: 1 },
    });
  }
});

// GET /api/organs/stats — organ statistics
router.get('/stats', async (req, res) => {
  try {
    const [typeDistribution, statusDistribution, totalOrgans] = await Promise.all([
      Organ.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Organ.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Organ.countDocuments(),
    ]);
    res.json({
      success: true,
      stats: {
        total: totalOrgans,
        byType: typeDistribution.reduce((a, i) => { a[i._id] = i.count; return a; }, {}),
        byStatus: statusDistribution.reduce((a, i) => { a[i._id] = i.count; return a; }, {}),
        viabilityWindows: Organ.VIABILITY_HOURS,
      },
    });
  } catch (error) {
    res.json({
      success: true, _demo: true,
      stats: {
        total: 87, byType: { kidney: 35, liver: 22, heart: 12, lung: 10, pancreas: 5, intestine: 3 },
        byStatus: { available: 45, allocated: 20, in_transit: 8, transplanted: 10, expired: 4 },
        viabilityWindows: { heart: 6, lung: 8, liver: 12, pancreas: 18, kidney: 36, intestine: 12 },
      },
    });
  }
});

// POST /api/organs — register a new organ
router.post('/', async (req, res) => {
  try {
    const { type, bloodType, donorId, donorAge, donorGender, donationBloodType, donationType,
      sourceHospitalId, sourceHospitalName, sourceRegion, qualityScore, condition, registeredBy } = req.body;
    if (!type || !bloodType || !donorId || !donationType || !sourceHospitalId || !sourceHospitalName) {
      return res.status(400).json({ success: false, error: 'type, bloodType, donorId, donationType, sourceHospitalId, and sourceHospitalName are required' });
    }
    const organ = new Organ({
      type, bloodType, donorId, donorAge, donorGender, donorBloodType: donationBloodType, donationType,
      sourceHospitalId, sourceHospitalName, sourceRegion, qualityScore: qualityScore || 85,
      condition: condition || 'good', harvestTime: new Date(), registeredBy,
    });
    await organ.save();
    await auditService.logAction({
      action: 'organ_registered', actor: { userId: registeredBy || 'system', userType: 'doctor' },
      entity: { entityType: 'organ', entityId: organ._id.toString(), entityName: `${type} (${bloodType})` },
      details: { description: `New ${type} organ registered from ${sourceHospitalName}` },
    });
    res.status(201).json({ success: true, organ });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/organs/:id — get organ details
router.get('/:id', async (req, res) => {
  try {
    const organ = await Organ.findById(req.params.id).lean();
    if (!organ) return res.status(404).json({ success: false, error: 'Organ not found' });
    res.json({ success: true, organ });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/organs/:id/status — update organ status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, allocatedToPatientId, allocatedToHospitalId } = req.body;
    const validStatuses = ['available', 'allocated', 'in_transit', 'transplanted', 'expired', 'discarded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const update = { status };
    if (status === 'allocated') {
      update.allocatedToPatientId = allocatedToPatientId;
      update.allocatedToHospitalId = allocatedToHospitalId;
      update.allocatedAt = new Date();
    }
    const organ = await Organ.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!organ) return res.status(404).json({ success: false, error: 'Organ not found' });
    await auditService.logAction({
      action: 'organ_status_changed', actor: { userId: req.body.updatedBy || 'system', userType: 'doctor' },
      entity: { entityType: 'organ', entityId: organ._id.toString(), entityName: `${organ.type} (${organ.bloodType})` },
      details: { description: `Organ status changed to ${status}` },
    });
    res.json({ success: true, organ });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
