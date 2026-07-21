const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        address: {
            name: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            building: {
                type: String,
                default: "",
            },

            address: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },

            image: {
                type: String,
                default: "",
            },
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: [
                "Google Pay",
                "PhonePe",
                "Paytm",
                "CARD",
                "Amazon Pay",
                "Mobikwik",
                "COD",
            ],
        },

        orderStatus: {
            type: String,
            enum: [
                "On Process",
                "Preparing",
                "Out For Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "On Process",
        },

        deliveryType: {
            type: String,
            enum: ["Express", "Standard", "Economy"],
            default: "Standard",
        },

        deliveryMinutes: {
            type: Number,
            required: true,
            min: 1,
        },

        estimatedDelivery: {
            type: Date,
            required: true,
        },

        completedAt: {
            type: Date,
        },

        rider: {
            name: {
                type: String,
                default: "",
            },
            vehicle: {
                type: String,
                default: "",
            },
            image: {
                type: String,
                default: "",
            },
        },

        deliveryCharge: {
            type: Number,
            default: 0,
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
            ],
            default: "Pending",
        },

        cancelReason: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);