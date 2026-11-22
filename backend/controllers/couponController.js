const Coupon = require("../models/couponModel");

const applyCoupon = async (req, res) => {

    try {

        const { code, subtotal } = req.body;

        if (!code) {

            return res.status(400).json({
                success: false,
                message: "Coupon code is required.",
            });

        }

        const coupon = await Coupon.findOne({
            code: code.trim().toUpperCase(),
        });

        if (!coupon) {

            return res.status(404).json({
                success: false,
                message: "Invalid coupon code.",
            });

        }

        if (!coupon.active) {

            return res.status(400).json({
                success: false,
                message: "This coupon is disabled.",
            });

        }

        if (coupon.expiresAt < new Date()) {

            return res.status(400).json({
                success: false,
                message: "This coupon has expired.",
            });

        }

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {

            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached.",
            });

        }

        if (subtotal < coupon.minOrder) {

            return res.status(400).json({
                success: false,
                message: `Minimum order should be ₹${coupon.minOrder}.`,
            });

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

        return res.status(200).json({

            success: true,

            message: "Coupon applied successfully.",

            coupon: {

                _id: coupon._id,

                code: coupon.code,

                type: coupon.type,

                value: coupon.value,

                discount: Math.round(discount),

            },

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {
    applyCoupon,
};