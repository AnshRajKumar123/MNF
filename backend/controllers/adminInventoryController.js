const Product = require("../models/Product");

exports.getInventory = async (req, res) => {

    try {

        const products = await Product.find().sort({ name: 1 });

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.updateStock = async (req, res) => {

    try {

        const { stock } = req.body;

        const product = await Product.findByIdAndUpdate(

            req.params.id,

            {
                stock
            },

            {
                new: true
            }

        );

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};