const express = require('express');
const router = express.Router();

// ── ABHA Integration ──────────────────────────────────────────────────

// GET /api/government/abha/verify — verify ABHA ID
router.get('/abha/verify', async (req, res) => {
  const { abhaId } = req.query;
  if (!abhaId) {
    return res.status(400).json({ success: false, error: 'abhaId query parameter is required' });
  }
  // Mock ABHA verification — in production, call the actual ABHA API
  const mockProfiles = {
    'AB-1234-5678-9012': { name: 'Raj Sharma', gender: 'male', dob: '1985-03-15', state: 'Delhi', verified: true },
    'AB-2345-6789-0123': { name: 'Priya Patel', gender: 'female', dob: '1990-07-22', state: 'Maharashtra', verified: true },
    'AB-3456-7890-1234': { name: 'Amit Kumar', gender: 'male', dob: '1978-11-08', state: 'Tamil Nadu', verified: true },
  };
  const profile = mockProfiles[abhaId];
  if (profile) {
    res.json({ success: true, verified: true, profile });
  } else {
    res.json({ success: true, verified: false, message: 'ABHA ID not found in the system' });
  }
});

// ── NOTTO Integration ────────────────────────────────────────────────

// GET /api/government/notto/stats — NOTTO allocation statistics
router.get('/notto/stats', async (req, res) => {
  // Mock NOTTO stats — in production, pull from NOTTO API
  res.json({
    success: true,
    data: {
      totalAllocations: 12456,
      currentYear: 2024,
      yearlyAllocations: 1834,
      organBreakdown: { kidney: 8920, liver: 2100, heart: 890, lung: 346, pancreas: 120, intestine: 80 },
      topStates: [
        { state: 'Tamil Nadu', allocations: 2340 },
        { state: 'Maharashtra', allocations: 2100 },
        { state: 'Delhi', allocations: 1890 },
        { state: 'Karnataka', allocations: 1560 },
        { state: 'Kerala', allocations: 1230 },
      ],
      waitingList: { total: 15234, critical: 2340, high: 4560, medium: 5890, low: 2444 },
      lastUpdated: new Date().toISOString(),
    },
  });
});

// POST /api/government/notto/report — submit allocation report to NOTTO
router.post('/notto/report', async (req, res) => {
  const { hospitalId, organType, patientId, allocationDate, outcome } = req.body;
  if (!hospitalId || !organType || !patientId) {
    return res.status(400).json({ success: false, error: 'hospitalId, organType, and patientId are required' });
  }
  // Mock submission — in production, submit to NOTTO reporting API
  res.json({
    success: true,
    reportId: `NOTTO-RPT-${Date.now()}`,
    message: 'Allocation report submitted to NOTTO successfully',
    submittedAt: new Date().toISOString(),
  });
});

// ── Ayushman Bharat Integration ─────────────────────────────────────

// GET /api/government/ayushman/eligibility — check Ayushman Bharat eligibility
router.get('/ayushman/eligibility', async (req, res) => {
  const { abhaId, aadhaarLast4 } = req.query;
  if (!abhaId && !aadhaarLast4) {
    return res.status(400).json({ success: false, error: 'abhaId or aadhaarLast4 is required' });
  }
  // Mock eligibility check
  res.json({
    success: true,
    eligible: true,
    scheme: 'Ayushman Bharat PM-JAY',
    coverageAmount: 500000,
    coverageCurrency: 'INR',
    validUntil: '2025-03-31',
    coveredProcedures: ['Kidney Transplant', 'Liver Transplant', 'Heart Transplant', 'Lung Transplant'],
    message: 'Patient is eligible for Ayushman Bharat coverage for organ transplant procedures',
  });
});

// GET /api/government/schemes — list available government schemes
router.get('/schemes', async (req, res) => {
  res.json({
    success: true,
    schemes: [
      { name: 'Ayushman Bharat PM-JAY', coverage: '₹5,00,000', description: 'Health insurance for BPL families', status: 'active' },
      { name: 'CGHS', coverage: 'As per schedule', description: 'Central Government Health Scheme', status: 'active' },
      { name: 'State Health Insurance', coverage: 'Varies by state', description: 'State-specific health insurance', status: 'active' },
      { name: 'RSBY', coverage: '₹30,000', description: 'Rashtriya Swasthya Bima Yojana', status: 'merged_into_pmjay' },
    ],
  });
});

module.exports = router;
