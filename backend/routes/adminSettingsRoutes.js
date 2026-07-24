const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuthMiddleware");

const {
    getSettings,
    updateSettings
} = require("../controllers/adminSettingsController");

router.get("/", adminAuth, getSettings);

router.put("/", adminAuth, updateSettings);

module.exports = router;