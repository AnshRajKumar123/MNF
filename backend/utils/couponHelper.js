const Coupon = require("../models/couponModel");

const validateCoupon = async (couponId, subtotal) => {

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        throw new Error("Coupon not found.");
    }

    if (!coupon.active) {
        throw new Error("This coupon is disabled.");
    }

    if (coupon.expiresAt < new Date()) {
        throw new Error("This coupon has expired.");
    }

    if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        throw new Error("Coupon usage limit reached.");
    }

    if (subtotal < coupon.minOrder) {
        throw new Error(
            `Minimum order should be ₹${coupon.minOrder}.`
        );
    }

    let discount = 0;

    if (coupon.type === "percentage") {

        discount = subtotal * (coupon.value / 100);

        if (
            coupon.maxDiscount &&
            discount > coupon.maxDiscount
        ) {
            discount = coupon.maxDiscount;
        }

    } else {

        discount = coupon.value;

    }

    return {
        coupon,
        discount: Math.round(discount),
    };

};

module.exports = {
    validateCoupon,
};