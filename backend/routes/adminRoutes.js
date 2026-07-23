const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminProfile,
} = require("../controllers/adminController");

const {
    getDashboard,
} = require("../controllers/adminDashboardController");

router.get(
    "/profile",
    authMiddleware,
    adminMiddleware,
    getAdminProfile
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboard
);

module.exports = router;