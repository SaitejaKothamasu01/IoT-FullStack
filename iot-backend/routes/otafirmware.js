const express = require('express');
const Device = require('../models/Device');
const router = express.Router();

// In-memory status store (replace with DB if needed)
const otaStatus = {};

// POST /api/ota/deploy
// Body: { version: "1.0.2", targetDevices: ["device-1", "device-2"] }
router.post('/deploy', async (req, res) => {
  const { version, targetDevices } = req.body;

  if (!version || !Array.isArray(targetDevices) || targetDevices.length === 0) {
    return res.status(400).json({ error: 'version and targetDevices are required' });
  }

  try {
    // Check if the firmware version already exists in the database
    const existingFirmware = await Device.findOne({ firmwareVersion: version });

    if (existingFirmware) {
      return res.status(400).json({ error: `Firmware version ${version} already exists. Please use a new version number.` });
    }

    // Update firmwareVersion in DB for target devices
    const result = await Device.updateMany(
      { deviceId: { $in: targetDevices } },
      { firmwareVersion: version }
    );

    // Initialize status for devices
    targetDevices.forEach((deviceId) => {
      otaStatus[deviceId] = 'Queued';  // Initial status for each device
    });

    // Simulate update process (replace with actual OTA logic)
    targetDevices.forEach((deviceId, i) => {
      setTimeout(() => {
        otaStatus[deviceId] = 'In Progress';  // Device starts updating
        setTimeout(() => {
          otaStatus[deviceId] = 'Completed';  // Device update completed
        }, 3000 + i * 1000);  // Add delay to simulate update
      }, i * 2000);  // Stagger updates for each device
    });

    res.json({
      message: `Firmware update to version ${version} triggered for ${result.modifiedCount} devices.`,
    });
  } catch (err) {
    console.error('Error deploying OTA update:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ota/status
// Query: deviceId=device-1
router.get('/status', (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId || !otaStatus[deviceId]) {
    return res.status(404).json({ error: 'Device not found or no OTA status available' });
  }
  res.json({ deviceId, status: otaStatus[deviceId] });
});

module.exports = router;
