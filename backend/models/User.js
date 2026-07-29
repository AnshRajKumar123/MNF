const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "IN",
        },

        dial: {
            type: String,
            default: "+91",
        },

        building: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        pincode: {
            type: String,
            default: "",
        },

        gender: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        imagePublicId: {
            type: String,
            default: "",
        },

        isAdmin: {
            type: Boolean,
            default: false,
        },

        twoFactorEnabled: {
            type: Boolean,
            default: false
        },

        twoFactorSecret: {
            type: String,
            default: ""
        },

        resetPasswordToken: {
            type: String,
            default: "",
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);