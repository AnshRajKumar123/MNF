const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuthMiddleware");

const createUploader = require("../config/multer");
const upload = createUploader("admin");

const {
    getProfile,
    updateProfile,
    changePassword,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor
} = require("../controllers/adminProfileController");

router.get(
    "/",
    adminAuth,
    getProfile
);

router.put(
    "/",
    adminAuth,
    upload.single("image"),
    updateProfile
);

router.put(
    "/change-password",
    adminAuth,
    changePassword
);

router.post(
    "/2fa/setup",
    adminAuth,
    setupTwoFactor
);

router.post(
    "/2fa/verify",
    adminAuth,
    verifyTwoFactor
);

router.put(
    "/2fa/disable",
    adminAuth,
    disableTwoFactor
);

module.exports = router;