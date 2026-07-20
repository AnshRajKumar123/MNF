const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    uploadProfileImage,
    removeProfileImage
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
    upload.single("image"),
    uploadProfileImage
);

router.delete(
    "/remove-profile-image",
    authMiddleware,
    removeProfileImage
);

module.exports = router;