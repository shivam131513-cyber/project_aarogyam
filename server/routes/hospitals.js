const express = require('express');
const router = express.Router();

// GET /api/hospitals - Get all hospitals
router.get('/', async (req, res) => {
  res.json({ message: 'Hospitals endpoint - under development' });
});

module.exports = router;
