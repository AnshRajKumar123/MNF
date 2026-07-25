const express = require("express");
const router = express.Router();
const createUploader = require("../config/multer");

const uploadProfile = createUploader("profile");

const {
    registerUser,
    loginUser,
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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.post(
    "/upload-profile-image",
    authMiddleware,
    uploadProfile.single("image"),
    uploadProfileImage
);

router.delete(
    "/remove-profile-image",
    authMiddleware,
    removeProfileImage
);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);

router.get(
    "/reset-password/:token",
    validateResetToken
);

module.exports = router;