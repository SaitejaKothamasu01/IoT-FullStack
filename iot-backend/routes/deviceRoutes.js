const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// Existing: GET /api/devices
router.get('/', async (req, res) => {
  const devices = await Device.find({}, '-healthHistory'); // exclude history from bulk load
  res.json(devices);
});

// 🆕 GET /api/devices/:deviceId/history
router.get('/:deviceId/history', async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId }, 'healthHistory');
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device.healthHistory);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
