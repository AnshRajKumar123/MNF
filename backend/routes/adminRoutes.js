const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminProfile,
} = require("../controllers/adminController");

router.get(
    "/profile",
    authMiddleware,
    adminMiddleware,
    getAdminProfile
);

module.exports = router;