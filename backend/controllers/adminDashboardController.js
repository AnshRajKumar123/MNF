const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        const recentOrders = await Order.find()
            .populate("user", "fullName email")
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getDashboard,
};