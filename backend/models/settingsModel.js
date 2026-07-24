const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    restaurantName: {
        type: String,
        default: "MidNight Food"
    },

    restaurantLogo: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    supportEmail: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    delivery: {

        baseCharge: {
            type: Number,
            default: 40
        },

        freeDeliveryAbove: {
            type: Number,
            default: 499
        },

        expressCharge: {
            type: Number,
            default: 80
        },

        maxDistance: {
            type: Number,
            default: 15
        }

    },

    payment: {

        razorpayEnabled: {
            type: Boolean,
            default: true
        },

        codEnabled: {
            type: Boolean,
            default: true
        }

    },

    notifications: {

        newOrder: {
            type: Boolean,
            default: true
        },

        lowStock: {
            type: Boolean,
            default: true
        },

        newUser: {
            type: Boolean,
            default: true
        }

    },

    appearance: {

        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "dark"
        },

        primaryColor: {
            type: String,
            default: "#6366F1"
        }

    }

}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);