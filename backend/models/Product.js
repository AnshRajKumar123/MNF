const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    alt: {
        type: String,
        default: "",
        trim: true,
    },

    image: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    currency: {
        type: String,
        default: "INR",
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],

    foodType: {
        type: String,
        enum: ["veg", "non-veg", "egg"],
        default: "veg",
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    sold: {
        type: Number,
        default: 0,
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    reviewCount: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);