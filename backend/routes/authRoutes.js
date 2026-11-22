const express = require("express");
const router = express.Router();
const createUploader = require("../config/multer");

const uploadProfile = createUploader("profile");

const {
    sendOtp,
    registerUser,
    loginUser,
    resetPasswordWithOtp,
    logoutUser,
    getProfile,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    forgotPassword,
    resetPassword,
    validateResetToken,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// ================= AUTH & OTP ROUTES =================
router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password-otp", resetPasswordWithOtp);

// ================= PROFILE ROUTES =================
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, uploadProfile.single("image"), updateProfile);

router.post(
    "/upload-profile-image",
    authMiddleware,
    (req, res, next) => {
        uploadProfile.single("image")(req, res, function (err) {
            if (err) {
                console.log("========== MULTER ERROR ==========");
                console.dir(err, { depth: null });

                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }
            next();
        });
    },
    uploadProfileImage
);

router.delete(
    "/remove-profile-image",
    authMiddleware,
    removeProfileImage
);

// ================= LEGACY / ADMIN RESET ROUTES =================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/reset-password/:token", validateResetToken);

module.exports = router;