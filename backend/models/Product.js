const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // Basic Info
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

    shortDescription: {
        type: String,
        default: "",
    },

    // Images
    image: {
        type: String,
        required: true,
    },

    gallery: [{
        type: String,
    }],

    // Pricing
    price: {
        type: Number,
        required: true,
    },

    originalPrice: {
        type: Number,
        default: 0,
    },

    discount: {
        type: Number,
        default: 0,
    },

    currency: {
        type: String,
        default: "INR",
    },

    // Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    subCategory: {
        type: String,
        default: "",
    },

    // Restaurant
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },

    // Food Type
    foodType: {
        type: String,
        enum: ["veg", "non-veg", "egg"],
        required: true,
    },

    // Availability
    isAvailable: {
        type: Boolean,
        default: true,
    },

    stock: {
        type: Number,
        default: 100,
    },

    // Rating
    rating: {
        type: Number,
        default: 0,
    },

    totalReviews: {
        type: Number,
        default: 0,
    },

    // Delivery
    preparationTime: {
        type: Number,
        default: 20,
    },

    // Search
    tags: [{
        type: String,
    }],

    // Featured
    isFeatured: {
        type: Boolean,
        default: false,
    },

    isPopular: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);