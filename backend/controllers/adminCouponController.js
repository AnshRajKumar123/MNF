const Coupon = require("../models/couponModel");

const createCoupon = async (req, res) => {
    try {

        const {
            code,
            type,
            value,
            minOrder,
            maxDiscount,
            usageLimit,
            expiresAt,
            description,
        } = req.body;

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase(),
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists.",
            });
        }

        const coupon = await Coupon.create({
            code,
            type,
            value,
            minOrder,
            maxDiscount,
            usageLimit,
            expiresAt,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully.",
            coupon,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getCoupons = async (req, res) => {
    try {

        const {
            search = "",
            status = "all",
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        // Search by coupon code
        if (search.trim()) {
            query.code = {
                $regex: search.trim(),
                $options: "i",
            };
        }

        // Active / Disabled filter
        if (status === "active") {
            query.active = true;
            query.expiresAt = { $gte: new Date() };
        }

        if (status === "disabled") {
            query.active = false;
        }

        if (status === "expired") {
            query.active = true;
            query.expiresAt = { $lt: new Date() };
        }

        const currentPage = Number(page);
        const pageLimit = Number(limit);

        const totalCoupons = await Coupon.countDocuments(query);

        const coupons = await Coupon.find(query)
            .sort({
                createdAt: -1,
            })
            .skip((currentPage - 1) * pageLimit)
            .limit(pageLimit);

        return res.status(200).json({
            success: true,
            coupons,

            pagination: {
                totalCoupons,
                currentPage,
                totalPages: Math.ceil(totalCoupons / pageLimit),
                limit: pageLimit,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        return res.status(200).json({
            success: true,
            coupon,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const updateCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully.",
            coupon,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const toggleCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        coupon.active = !coupon.active;

        await coupon.save();

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon.active ? "activated" : "disabled"
                }.`,
            coupon,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const deleteCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        await coupon.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    toggleCoupon,
    deleteCoupon,
};