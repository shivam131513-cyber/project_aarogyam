const express = require('express');
const router = express.Router();

// GET /api/patients - Get all patients (for hospitals/admin)
router.get('/', async (req, res) => {
  res.json({ message: 'Patients endpoint - under development' });
});

// POST /api/patients/register - Register patient for organ waiting list
router.post('/register', async (req, res) => {
  res.json({ message: 'Patient registration endpoint - under development' });
});

module.exports = router;
