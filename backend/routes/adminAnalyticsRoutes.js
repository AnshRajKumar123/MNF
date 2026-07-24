const express = require("express");

const router = express.Router();

const {
    getDashboardAnalytics,
} = require("../controllers/adminAnalyticsController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/",
    adminAuthMiddleware,
    adminMiddleware,
    getDashboardAnalytics
);

module.exports = router;