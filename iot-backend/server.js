const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Device = require('./models/Device');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const firmwareRoutes = require("./routes/firmware");
const otaFirmwareRoutes = require("./routes/otafirmware");

app.use("/uploads", express.static("uploads"));
app.use("/api/firmware", firmwareRoutes);
app.use("/api/ota", otaFirmwareRoutes);

// GET all devices (basic info)
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find({}, '-healthHistory').lean();

    // Separate valid and invalid devices based on deviceId format
    const validDevices = devices.filter(d => d.deviceId && d.deviceId.includes('-'));
    const invalidDevices = devices.filter(d => !d.deviceId || !d.deviceId.includes('-'));

    //
    //if (invalidDevices.length > 0) {
    //  console.log('Devices with invalid/missing deviceId:', invalidDevices.map(d => ({ _id: d._id, deviceId: d.deviceId })));
    //}

    // Sort valid devices by numeric part of deviceId
    validDevices.sort((a, b) => {
      const getNum = (device) => {
        const parts = device.deviceId.split('-');
        const num = parseInt(parts[1], 10);
        return isNaN(num) ? 0 : num;
      };
      return getNum(a) - getNum(b);
    });

    res.json(validDevices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single device by deviceId with healthHistory
app.get('/api/devices/:deviceId', async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId }).lean();
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
