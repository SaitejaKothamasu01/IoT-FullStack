const express = require("express");
const multer = require("multer");
const path = require("path");
const Firmware = require("../models/Firmware");
const fs = require("fs");

const router = express.Router();

// Set up local storage for firmware files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/firmware
router.post("/", upload.single("firmware"), async (req, res) => {
  const { version } = req.body;
  const file = req.file;

  if (!version || !file) {
    return res.status(400).json({ error: "Version and file are required." });
  }

  try {
    const existing = await Firmware.findOne({ version });
    if (existing) {
      return res.status(400).json({ error: "Firmware version already exists." });
    }

    const newFirmware = new Firmware({
      version,
      fileUrl: `http://localhost:5000/uploads/${file.filename}`,
    });

    await newFirmware.save();
    res.status(201).json(newFirmware);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/firmware
router.get("/", async (req, res) => {
  try {
    const firmwareList = await Firmware.find().sort({ uploadedAt: -1 });
    res.json(firmwareList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
