const express = require("express");

const router = express.Router();

const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    toggleCoupon,
    deleteCoupon,
} = require("../controllers/adminCouponController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All coupon routes require admin authentication
router.use(adminAuthMiddleware, adminMiddleware);

// Create Coupon
router.post("/", createCoupon);

// Get All Coupons
router.get("/", getCoupons);

// Get Single Coupon
router.get("/:id", getCoupon);

// Update Coupon
router.put("/:id", updateCoupon);

// Enable / Disable Coupon
router.patch("/:id/toggle", toggleCoupon);

// Delete Coupon
router.delete("/:id", deleteCoupon);

module.exports = router;