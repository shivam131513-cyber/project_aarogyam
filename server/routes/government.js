const express = require('express');
const router = express.Router();

// GET /api/government/abha - ABHA integration
router.get('/abha', async (req, res) => {
  res.json({ message: 'ABHA integration - under development' });
});

module.exports = router;
