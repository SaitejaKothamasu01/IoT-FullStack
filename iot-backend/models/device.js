const mongoose = require('mongoose');

const HealthHistorySchema = new mongoose.Schema({
  cpu: Number,
  memory: Number,
  battery: Number,
  connectivity: String,
  timestamp: Date,
}, { _id: false });

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true, required: true },
  firmwareVersion: String,
  location: {
    lat: Number,
    lng: Number,
  },
  health: {
    cpu: Number,
    memory: Number,
    battery: Number,
    connectivity: String,
  },
  lastActive: Date,
  status: String,
  healthHistory: [HealthHistorySchema],  // last 10 points
}, { versionKey: false });

module.exports = mongoose.model('Device', DeviceSchema);
