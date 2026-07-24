import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const RecentOrders = ({ orders }) => {

    return (

        <div className="DashboardBentoCard">

            <div className="BentoCardHeader">

                <h3>

                    <i className="bx bx-receipt"></i>

                    Recent Orders

                </h3>

            </div>

            <table className="RecentOrdersTable">

                <thead>

                    <tr>

                        <th>Order</th>

                        <th>Customer</th>

                        <th>Total</th>

                        <th>Payment</th>

                        <th>Status</th>

                        <th>Time</th>

                    </tr>

                </thead>

                <tbody>

                    {orders.map((order) => (

                        <tr key={order._id}>

                            <td>#{order._id.slice(-6).toUpperCase()}</td>

                            <td>{order.user?.fullName}</td>

                            <td>₹{order.totalAmount}</td>

                            <td>{order.paymentStatus}</td>

                            <td>{order.orderStatus}</td>

                            <td>{dayjs(order.createdAt).fromNow()}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default RecentOrders;