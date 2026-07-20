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
    },

    description: {
        type: String,
        required: true,
    },

    currency: {
        type: String,
        default: "INR",
    },
    
    image: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    foodType: {
        type: String,
        enum: ["veg", "non-veg", "egg"],
        required: true,
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
    },

    reviewCount: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);