const Razorpay = require("razorpay");
const crypto = require("crypto");

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

module.exports = {
    razorpay,
    createOrder,
    verifyPayment,
};