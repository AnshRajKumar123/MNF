import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const RecentOrders = ({ orders }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case "Delivered":
                return <span className="RecentStatusBadge Delivered">Delivered</span>;
            case "Cancelled":
                return <span className="RecentStatusBadge Cancelled">Cancelled</span>;
            case "Out for Delivery":
                return <span className="RecentStatusBadge Transit">In-Transit</span>;
            default:
                return <span className="RecentStatusBadge Pending">{status}</span>;
        }
    };

    return (
        <div className="DashboardBentoCard RecentOrdersCard">
            <div className="BentoCardHeader">
                <h3>
                    <i className="bx bx-receipt"></i>
                    Recent Order Activity
                </h3>
            </div>

            <div className="RecentOrdersTableWrapper">
                <table className="RecentOrdersTable">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th className="TextRight">Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(!orders || orders.length === 0) ? (
                            <tr>
                                <td colSpan="6" className="EmptyText">
                                    No recent dispatches logged.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <span className="RecentOrderId">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="RecentCustomerName">
                                            {order.user?.fullName || "Guest Customer"}
                                        </strong>
                                    </td>

                                    <td>
                                        <strong className="RecentAmount">₹{order.totalAmount}</strong>
                                    </td>

                                    <td>
                                        <span className="PaymentStatusText">{order.paymentStatus}</span>
                                    </td>

                                    <td>{getStatusBadge(order.orderStatus)}</td>

                                    <td className="TextRight">
                                        <span className="RelativeTimeText">
                                            {dayjs(order.createdAt).fromNow()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;