const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {

        const products = await Product
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const addProduct = async (req, res) => {
    try {

        const {
            name,
            category,
            price,
            description,
            foodType,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required",
            });
        }

        const product = await Product.create({
            name,
            category,
            price,
            description,
            foodType,
            image: `/uploads/${req.file.filename}`,
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getProducts,
    addProduct,
};