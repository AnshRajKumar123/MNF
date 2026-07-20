const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {

    try {

        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const existingItem = await Cart.findOne({
            user: userId,
            product: productId,
        });

        if (existingItem) {

            existingItem.quantity += quantity;

            await existingItem.save();

            return res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                cart: existingItem,
            });

        }

        const cartItem = await Cart.create({
            user: userId,
            product: productId,
            quantity,
        });

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            cart: cartItem,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const cart = await Cart.find({
            user: userId,
        }).populate("product");

        return res.status(200).json({
            success: true,
            cart,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const removeCartItem = async (req, res) => {

    try {

        const { cartId } = req.params;

        await Cart.findByIdAndDelete(cartId);

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    addToCart,
    getCart,
    removeCartItem
};