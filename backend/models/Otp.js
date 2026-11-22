const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
            enum: ["registration", "forgot_password"],
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // Automatically deletes after 10 minutes (600s)
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);