const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["percentage", "fixed"],
            default: "percentage",
        },

        value: {
            type: Number,
            required: true,
            min: 1,
        },

        minOrder: {
            type: Number,
            default: 0,
        },

        maxDiscount: {
            type: Number,
            default: 0,
        },

        usageLimit: {
            type: Number,
            default: 0, // 0 = Unlimited
        },

        usedCount: {
            type: Number,
            default: 0,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        active: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Coupon", couponSchema);