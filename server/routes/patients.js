const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auditService = require('../services/auditService');

// GET /api/patients — list patients with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, organType, urgencyLevel, region, status, search } = req.query;
    const query = {};
    if (organType) query.organNeeded = organType;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    if (region) query.region = region;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { 'name.first': { $regex: search, $options: 'i' } },
        { 'name.last': { $regex: search, $options: 'i' } },
        { abhaId: { $regex: search, $options: 'i' } },
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(query).sort({ urgencyScore: -1, createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).lean(),
      Patient.countDocuments(query),
    ]);

    res.json({
      success: true, patients, pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    // Fallback demo data if DB is not connected
    res.json({
      success: true, _demo: true,
      patients: [
        { _id: 'P001', name: { first: 'Raj', last: 'Sharma' }, bloodType: 'A+', organNeeded: 'kidney', urgencyScore: 85, urgencyLevel: 'high', status: 'waiting', region: 'Delhi NCR', hospitalName: 'AIIMS Delhi' },
        { _id: 'P002', name: { first: 'Priya', last: 'Patel' }, bloodType: 'B+', organNeeded: 'liver', urgencyScore: 92, urgencyLevel: 'critical', status: 'waiting', region: 'Mumbai', hospitalName: 'Tata Memorial' },
        { _id: 'P003', name: { first: 'Amit', last: 'Kumar' }, bloodType: 'O+', organNeeded: 'heart', urgencyScore: 78, urgencyLevel: 'high', status: 'waiting', region: 'Chennai', hospitalName: 'CMC Vellore' },
        { _id: 'P004', name: { first: 'Sunita', last: 'Devi' }, bloodType: 'AB+', organNeeded: 'kidney', urgencyScore: 65, urgencyLevel: 'medium', status: 'matched', region: 'Kolkata', hospitalName: 'SSKM Hospital' },
        { _id: 'P005', name: { first: 'Vikram', last: 'Singh' }, bloodType: 'O-', organNeeded: 'liver', urgencyScore: 88, urgencyLevel: 'critical', status: 'waiting', region: 'Delhi NCR', hospitalName: 'Safdarjung Hospital' },
      ],
      pagination: { total: 5, page: 1, limit: 20, totalPages: 1 },
    });
  }
});

// POST /api/patients/register — register a new patient
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone, email, bloodType, organNeeded, urgencyScore, region, hospitalId, hospitalName, abhaId } = req.body;
    if (!firstName || !lastName || !bloodType || !organNeeded) {
      return res.status(400).json({ success: false, error: 'firstName, lastName, bloodType, and organNeeded are required' });
    }
    const patient = new Patient({
      name: { first: firstName, last: lastName }, dateOfBirth, gender, phone, email,
      bloodType, organNeeded, urgencyScore: urgencyScore || 50,
      urgencyLevel: urgencyScore >= 90 ? 'critical' : urgencyScore >= 80 ? 'high' : urgencyScore >= 60 ? 'medium' : 'low',
      region, hospitalId, hospitalName, abhaId,
    });
    await patient.save();
    await auditService.logAction({
      action: 'patient_registered', actor: { userId: 'system', userType: 'system' },
      entity: { entityType: 'patient', entityId: patient._id.toString(), entityName: `${firstName} ${lastName}` },
      details: { description: `Patient ${firstName} ${lastName} registered for ${organNeeded} transplant` },
    });
    res.status(201).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/patients/:id — get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).lean();
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/patients/:id/status — update patient status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const validStatuses = ['waiting', 'matched', 'transplanted', 'inactive', 'deceased'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const patient = await Patient.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    await auditService.logAction({
      action: 'patient_updated', actor: { userId: req.body.updatedBy || 'system', userType: 'doctor' },
      entity: { entityType: 'patient', entityId: patient._id.toString(), entityName: patient.fullName },
      details: { description: `Patient status changed to ${status}`, reason },
    });
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/patients/:id/history — get patient's allocation history
router.get('/:id/history', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('allocationHistory name').lean();
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, patientName: `${patient.name.first} ${patient.name.last}`, history: patient.allocationHistory || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
