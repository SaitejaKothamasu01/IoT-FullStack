const mongoose = require('mongoose');

const HealthDataSchema = new mongoose.Schema({
  deviceId: { type: String, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  health: {
    cpu: Number,
    memory: Number,
    battery: Number,
    connectivity: String,
  }
});

HealthDataSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('HealthData', HealthDataSchema);
