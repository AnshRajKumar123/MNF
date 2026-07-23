const Product = require("../models/Product");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

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

        console.error(error);

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

        const slug = slugify(name, {
            lower: true,
            strict: true,
        });

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required",
            });
        }

        const product = await Product.create({
            name,
            slug,
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

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            category,
            price,
            description,
            foodType,
            isAvailable,
        } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.name = name;
        product.slug = slugify(name, {
            lower: true,
            strict: true,
        });
        product.category = category;
        product.price = price;
        product.description = description;
        product.foodType = foodType;
        product.isAvailable = isAvailable;

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.image) {

            const imagePath = path.join(
                __dirname,
                "../public",
                product.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
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
    updateProduct,
    deleteProduct
};