const Category = require("../models/Category");

const createCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Category image is required.",
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists.",
            });
        }

        const category = await Category.create({

            name: name.trim(),

            description,

            image: `/uploads/categories/${req.file.filename}`,

        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getAllCategories = async (req, res) => {

    try {

        const categories = await Category.find({
            isActive: true,
        }).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            categories,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    createCategory,
    getAllCategories,
};