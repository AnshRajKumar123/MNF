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

module.exports = {
    getProducts,
};