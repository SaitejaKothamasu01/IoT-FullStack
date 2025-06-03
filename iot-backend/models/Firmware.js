const mongoose = require("mongoose");

const FirmwareSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Firmware", FirmwareSchema);
