const express = require('express');
const router = express.Router();

// GET /api/organs - Get available organs
router.get('/', async (req, res) => {
  res.json({ message: 'Organs endpoint - under development' });
});

module.exports = router;
