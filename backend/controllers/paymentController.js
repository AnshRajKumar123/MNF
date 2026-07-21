const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Convert ₹ to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {

        console.log("Razorpay Error:");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
        });

    }

};

const verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,

        } = req.body;

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body.toString())
                .digest("hex");

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,
                message: "Payment verification failed",

            });

        }

        return res.json({

            success: true,
            message: "Payment verified",

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

        });

    }

};

const payExistingOrder = async (req, res) => {
    try {

        const { orderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = "Paid";

        await order.save();

        res.json({
            success: true,
            message: "Payment updated"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }
};

module.exports = {
    razorpay,
    createOrder,
    verifyPayment,
    payExistingOrder,
};