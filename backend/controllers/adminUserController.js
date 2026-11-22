const User = require("../models/User");
const Order = require("../models/Order");

// Get all users
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        const orders = await Order.find().select("user totalAmount");

        const usersWithStats = users.map((user) => {

            const userOrders = orders.filter(
                (order) => order.user.toString() === user._id.toString()
            );

            const totalOrders = userOrders.length;

            const totalSpent = userOrders.reduce(
                (sum, order) => sum + order.totalAmount,
                0
            );

            return {
                ...user.toObject(),
                totalOrders,
                totalSpent,
            };
        });

        return res.status(200).json({
            success: true,
            users: usersWithStats,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get single user
const getSingleUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const orders = await Order.find({
            user: id,
        })
            .populate({
                path: "items.product",
                select: "name image price category",
            })
            .sort({
                createdAt: -1,
            });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
        );

        return res.status(200).json({
            success: true,
            user,
            orders,
            totalOrders,
            totalSpent,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
};