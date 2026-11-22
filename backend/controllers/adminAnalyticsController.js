const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Coupon = require("../models/couponModel");

const getLast7DaysRevenue = async () => {

    return await Order.aggregate([

        {
            $match: {
                paymentStatus: "Paid"
            }
        },

        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                revenue: {
                    $sum: "$totalAmount"
                },
                orders: {
                    $sum: 1
                }
            }
        },

        {
            $sort: {
                _id: 1
            }
        }

    ]);

};

const getTopSellingProducts = async () => {

    return await Order.aggregate([

        {
            $unwind: "$items"
        },

        {
            $group: {

                _id: "$items.product",

                sold: {
                    $sum: "$items.quantity"
                }

            }

        },

        {
            $sort: {
                sold: -1
            }
        },

        {
            $limit: 5
        },

        {
            $lookup: {

                from: "products",

                localField: "_id",

                foreignField: "_id",

                as: "product"

            }

        },

        {
            $unwind: "$product"
        },

        {
            $project: {

                _id: 0,

                name: "$product.name",

                image: "$product.image",

                category: "$product.category",

                sold: 1

            }

        }

    ]);

};

const getPaymentMethods = async () => {

    return await Order.aggregate([

        {
            $group: {

                _id: "$paymentMethod",

                total: {
                    $sum: 1
                }

            }

        },

        {
            $sort: {
                total: -1
            }
        }

    ]);

};

const getDeliveryTypes = async () => {

    return await Order.aggregate([

        {
            $group: {

                _id: "$deliveryType",

                total: {
                    $sum: 1
                }

            }

        },

        {
            $sort: {
                total: -1
            }
        }

    ]);

};

const getRecentOrders = async () => {

    return await Order.find()

        .populate("user", "fullName email")

        .sort({ createdAt: -1 })

        .limit(8)

        .select(
            "orderNumber totalAmount paymentStatus orderStatus deliveryType createdAt"
        );

};

const getDashboardAnalytics = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const [
            orders,
            totalUsers,
            totalProducts,
            coupons,
            revenueChart,
            topProducts,
            paymentMethods,
            deliveryTypes,
            recentOrders
        ] = await Promise.all([

            Order.find(),

            User.countDocuments(),

            Product.countDocuments(),

            Coupon.find(),

            getLast7DaysRevenue(),

            getTopSellingProducts(),

            getPaymentMethods(),

            getDeliveryTypes(),

            getRecentOrders()

        ]);

        const totalOrders = orders.length;

        const totalRevenue = orders
            .filter(order => order.paymentStatus === "Paid")
            .reduce(
                (sum, order) => sum + order.totalAmount,
                0
            );

        const todayOrders = orders.filter(order =>
            order.createdAt >= today
        ).length;

        const todayRevenue = orders
            .filter(order =>
                order.paymentStatus === "Paid" &&
                order.createdAt >= today
            )
            .reduce(
                (sum, order) => sum + order.totalAmount,
                0
            );

        const activeCoupons = coupons.filter(c => c.active).length;

        const redeemedCoupons = coupons.reduce(
            (sum, coupon) => sum + coupon.usedCount,
            0
        );

        res.status(200).json({

            success: true,

            analytics: {

                revenue: {
                    total: totalRevenue,
                    today: todayRevenue,
                },

                orders: {
                    total: totalOrders,
                    today: todayOrders,
                },

                users: {
                    total: totalUsers,
                },

                products: {
                    total: totalProducts,
                },

                coupons: {
                    active: activeCoupons,
                    redeemed: redeemedCoupons,
                },

                revenueChart,

                topProducts,

                paymentMethods,

                deliveryTypes,

                recentOrders


            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};


module.exports = {
    getDashboardAnalytics,

};