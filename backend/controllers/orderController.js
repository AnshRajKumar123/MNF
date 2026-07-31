const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { validateCoupon } = require("../utils/couponHelper");
const Coupon = require("../models/couponModel");
const Settings = require("../models/Settings");

const placeOrder = async (req, res) => {

    try {

        const {
            address,
            paymentMethod,
            deliveryType = "standard",
            coupon,
            tip = 0,
            paymentStatus,
        } = req.body;

        const cart = await Cart.find({
            user: req.user.id,
        }).populate("product");

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
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        let discount = 0;
        let couponCode = "";
        let validatedCoupon = null;

        if (coupon?._id) {

            const result = await validateCoupon(
                coupon._id,
                foodTotal
            );

            validatedCoupon = result.coupon;
            discount = result.discount;
            couponCode = validatedCoupon.code;

        }

        const settings = await Settings.findOne();

        const deliverySettings =
            settings?.delivery || {};

        const BASE_CHARGE =
            Number(deliverySettings.baseCharge) || 40;

        const EXPRESS_CHARGE =
            Number(deliverySettings.expressCharge) || 80;

        const FREE_DELIVERY_ABOVE =
            Number(
                deliverySettings.freeDeliveryAbove
            ) || 499;

        let shippingCharge = 0;
        let deliveryCharge = 0;
        let deliveryMinutes = 20;

        switch (deliveryType) {

            case "express":

                shippingCharge =
                    foodTotal >= FREE_DELIVERY_ABOVE
                        ? 0
                        : BASE_CHARGE;

                deliveryCharge =
                    EXPRESS_CHARGE;

                deliveryMinutes = 15;

                break;

            case "standard":

                shippingCharge =
                    foodTotal >= FREE_DELIVERY_ABOVE
                        ? 0
                        : BASE_CHARGE;

                deliveryCharge = 0;

                deliveryMinutes = 20;

                break;

            case "economy":

                shippingCharge = 0;

                deliveryCharge = 0;

                deliveryMinutes = 25;

                break;

            default:

                shippingCharge =
                    foodTotal >= FREE_DELIVERY_ABOVE
                        ? 0
                        : BASE_CHARGE;

                deliveryCharge = 0;

                deliveryMinutes = 20;

        }

        const totalAmount =
            foodTotal -
            discount +
            shippingCharge +
            deliveryCharge +
            Number(tip);

        const estimatedDelivery = new Date(
            Date.now() +
            deliveryMinutes * 60 * 1000
        );

        const riders = [

            {
                name: "Rohit Kumar",
                phone: "9876543210",
                vehicle: "UP14 AQ 9921",
                image: "https://cdn-icons-png.flaticon.com/512/3917/3917036.png",
            },

            {
                name: "Aman Singh",
                phone: "9123456780",
                vehicle: "DL8CAF9021",
                image: "https://cdn-icons-png.flaticon.com/512/3917/3917036.png",
            },

            {
                name: "Rahul Verma",
                phone: "9988776655",
                vehicle: "HR26BF3321",
                image: "https://cdn-icons-png.flaticon.com/512/3917/3917036.png",
            },

        ];

        const rider =
            riders[
            Math.floor(
                Math.random() *
                riders.length
            )
            ];

        const order = await Order.create({

            user: req.user.id,

            items,

            subtotal: foodTotal,

            discount,

            shippingCharge,

            deliveryCharge,

            totalAmount,

            address,

            paymentMethod,

            paymentStatus:
                paymentStatus || "Pending",

            deliveryType,

            deliveryMinutes,

            tip: Number(tip),

            couponCode,

            estimatedDelivery,

            rider,

        });

        if (validatedCoupon) {

            await Coupon.findByIdAndUpdate(
                validatedCoupon._id,
                {
                    $inc: {
                        usedCount: 1,
                    },
                }
            );

        }

        await Cart.deleteMany({
            user: req.user.id,
        });

        return res.status(201).json({

            success: true,

            message:
                "Order placed successfully",

            order,

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

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
            serverTime: new Date(),
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

const myOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id,
        })
            .populate("items.product")
            .sort({
                createdAt: -1,
            });

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

const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Delivered orders cannot be cancelled.",
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled.",
            });
        }

        order.orderStatus = "Cancelled";
        order.cancelReason = "Cancelled by user";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully.",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
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
                success: false,
                message: "Order not found",
            });
        }

        await order.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Order removed successfully.",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

module.exports = {
    placeOrder,
    getOrder,
    myOrders,
    cancelOrder,
    deleteOrder,
};