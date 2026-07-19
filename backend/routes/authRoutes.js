const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { registerUser, loginUser, logoutUser, getProfile } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/logout", getProfile);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to your profile",
    });
});

module.exports = router;