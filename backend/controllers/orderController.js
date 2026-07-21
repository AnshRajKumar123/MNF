const Order = require("../models/Order");
const Cart = require("../models/Cart");

const placeOrder = async (req, res) => {

    try {

        const {
            address,
            paymentMethod,
            deliveryType,
        } = req.body;

        const cart = await Cart.find({ user: req.user.id })
            .populate("product");

        if (cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const items = cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        }));

        const foodTotal = items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        let deliveryMinutes = 30;
        let deliveryCharge = 0;

        switch (deliveryType) {

            case "Express":
                deliveryMinutes = 20;
                deliveryCharge = 49;
                break;

            case "Standard":
                deliveryMinutes = 30;
                deliveryCharge = 0;
                break;

            case "Economy":
                deliveryMinutes = 45;
                deliveryCharge = 0;
                break;

            default:
                deliveryMinutes = 30;
                deliveryCharge = 0;

        }

        const totalAmount = foodTotal + deliveryCharge;

        const estimatedDelivery = new Date(
            Date.now() + deliveryMinutes * 60 * 1000
        );

        const riders = [
            {
                name: "Rohit Kumar",
                vehicle: "UP14 AQ 9921",
                image: "/Uploads/riders/rider1.png",
            },
            {
                name: "Aman Singh",
                vehicle: "DL05 AB 4421",
                image: "/Uploads/riders/rider2.png",
            },
            {
                name: "Rahul Verma",
                vehicle: "HR26 TR 1182",
                image: "/Uploads/riders/rider3.png",
            },
        ];

        const rider = riders[Math.floor(Math.random() * riders.length)];

        const order = await Order.create({
            user: req.user.id,

            items,
            totalAmount,
            address,
            paymentMethod,
            deliveryType,
            deliveryMinutes,
            deliveryCharge,
            estimatedDelivery,
            rider,
        });

        await Cart.deleteMany({ user: req.user.id });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

const myOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

const getOrder = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                message: "Delivered orders cannot be cancelled.",
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                message: "Order is already cancelled.",
            });
        }

        await Order.updateOne(
            { _id: order._id },
            {
                $set: {
                    orderStatus: "Cancelled",
                    cancelReason: "Cancelled by user",
                },
            }
        );

        res.json({
            success: true,
            message: "Order cancelled successfully.",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }

};

const deleteOrder = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        await order.deleteOne();

        res.json({
            success: true,
            message: "Order removed successfully.",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }

};

module.exports = {
    placeOrder,
    myOrders,
    getOrder,
    cancelOrder,
    deleteOrder
};