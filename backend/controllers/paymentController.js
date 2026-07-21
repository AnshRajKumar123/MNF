const Razorpay = require("razorpay");

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

module.exports = {
    createOrder,
    razorpay,
};