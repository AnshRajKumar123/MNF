const Order = require("../models/Order");

const startOrderScheduler = () => {

    setInterval(async () => {

        try {

            const now = new Date();

            const result = await Order.updateMany(
                {
                    orderStatus: "On Process",
                    estimatedDelivery: { $lte: now },
                },
                {
                    $set: {
                        orderStatus: "Delivered",
                        completedAt: now,
                    },
                }
            );

            if (result.modifiedCount > 0) {

                console.log(
                    `✅ ${result.modifiedCount} order(s) marked as Delivered`
                );

            }

        } catch (error) {

            console.log("Order Scheduler Error:", error);

        }

    }, 1000); // Every 1 minute. 60 * 1000

};

module.exports = startOrderScheduler;