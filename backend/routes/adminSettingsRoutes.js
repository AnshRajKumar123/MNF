const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuthMiddleware");

const createUploader = require("../config/multer");
const upload = createUploader("settings");

const {
    getSettings,
    updateSettings
} = require("../controllers/adminSettingsController");

router.get("/", adminAuth, getSettings);

router.put(
    "/",
    adminAuth,
    upload.single("restaurantLogo"),
    updateSettings
);

module.exports = router;