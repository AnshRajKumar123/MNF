import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService";
import "../styles/Orders.css";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (id, status) => {

        try {

            await updateOrderStatus(id, status);

            loadOrders();

        } catch (error) {

            console.error(error);
            alert("Failed to update order status");

        }

    };
    return (
        <div className="OrdersPage">

            <h1>Orders</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="OrdersTable">

                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {orders.map((order) => (

                            <tr key={order._id}>

                                <td>{order._id.slice(-6)}</td>

                                <td>
                                    {order.user?.fullName}
                                </td>

                                <td>
                                    ₹{order.totalAmount}
                                </td>

                                <td>
                                    {order.paymentMethod}
                                </td>

                                <td>
                                    <select
                                        className="StatusSelect"
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>

                                <td>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    )
}

export default Orders