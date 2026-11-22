const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Lazy-initialize or fallback safely
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        console.error("❌ CRITICAL: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in backend .env");
    }

    return new Razorpay({ key_id, key_secret });
};

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const numericAmount = Number(amount);
        if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid positive numeric amount is required to create an order.",
            });
        }

        const razorpay = getRazorpayInstance();

        // Convert ₹ to paise and round to the nearest whole integer
        const options = {
            amount: Math.round(numericAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("❌ Razorpay Order Creation Error:", error?.error || error);

        return res.status(500).json({
            success: false,
            message: error?.error?.description || error.message || "Failed to create Razorpay order",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during payment verification",
        });
    }
};

const payExistingOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.paymentStatus = "Paid";
        await order.save();

        res.json({
            success: true,
            message: "Payment updated",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    payExistingOrder,
};