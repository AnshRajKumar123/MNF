const Product = require("../models/Product");

const getAllProducts = async (req, res) => {

    try {

        const products = await Product.find({
            isAvailable: true,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getAllProducts,
};