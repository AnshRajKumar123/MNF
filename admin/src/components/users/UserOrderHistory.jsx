const UserOrderHistory = ({ orders }) => {

    const getStatusClass = (status) => {

        switch (status) {
            case "Pending":
                return "StatusPending";

            case "Preparing":
                return "StatusPreparing";

            case "Out for Delivery":
                return "StatusDelivery";

            case "Delivered":
                return "StatusDelivered";

            case "Cancelled":
                return "StatusCancelled";

            default:
                return "";
        }

    };

    if (!orders.length) {
        return (
            <div className="UserOrderHistory">

                <h3>
                    <i className="bx bx-package"></i>
                    Order History
                </h3>

                <p className="NoOrders">
                    This user hasn't placed any orders yet.
                </p>

            </div>
        );
    }

    return (

        <div className="UserOrderHistory">

            <h3>
                <i className="bx bx-package"></i>
                Order History
            </h3>

            {orders.map((order) => (

                <div
                    key={order._id}
                    className="OrderCard"
                >

                    <div className="OrderHeader">

                        <div>

                            <h4>
                                Order #{order._id.slice(-8)}
                            </h4>

                            <small>
                                {new Date(order.createdAt).toLocaleString()}
                            </small>

                        </div>

                        <span
                            className={`OrderStatus ${getStatusClass(order.orderStatus)}`}
                        >
                            {order.orderStatus}
                        </span>

                    </div>

                    <div className="OrderDetails">

                        <div className="OrderInfoBox">
                            <span>Subtotal</span>
                            <p>₹{order.subtotal}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Discount</span>
                            <p>- ₹{order.discount}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Delivery Charge</span>
                            <p>₹{order.deliveryCharge}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Tip</span>
                            <p>₹{order.tip}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Total</span>
                            <p>₹{order.totalAmount}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Payment</span>
                            <p>{order.paymentMethod}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Payment Status</span>
                            <p>{order.paymentStatus}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Coupon</span>
                            <p>{order.couponCode || "None"}</p>
                        </div>

                    </div>

                    <div className="OrderItems">

                        <h5>Ordered Items</h5>

                        {order.items.map((item, index) => {

                            const product = item.product;

                            const backendURL = import.meta.env.VITE_API_URL;

                            const image = product?.image
                                ? `${backendURL}/${product.image.replace(/^\/+/, "")}`
                                : "https://placehold.co/80x80?text=Food";

                            return (

                                <div
                                    key={index}
                                    className="OrderItem"
                                >

                                    <img
                                        src={image}
                                        alt={product?.name}
                                    />

                                    <div className="ItemInfo">

                                        <h6>
                                            {product?.name || "Deleted Product"}
                                        </h6>

                                        <span>
                                            Category : {product?.category || "-"}
                                        </span>

                                    </div>

                                    <div className="ItemMeta">

                                        <span>
                                            Qty : {item.quantity}
                                        </span>

                                        <span>
                                            ₹{item.price}
                                        </span>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                    <div className="DeliverySection">

                        <h5>Delivery Information</h5>

                        <div className="DeliveryGrid">

                            <div className="DeliveryCard">
                                <span>Delivery Type</span>
                                <p>{order.deliveryType}</p>
                            </div>

                            <div className="DeliveryCard">
                                <span>Delivery Time</span>
                                <p>{order.deliveryMinutes} min</p>
                            </div>

                            <div className="DeliveryCard">
                                <span>Estimated Delivery</span>
                                <p>
                                    {new Date(order.estimatedDelivery).toLocaleString()}
                                </p>
                            </div>

                            <div className="DeliveryCard">
                                <span>Completed At</span>
                                <p>
                                    {order.completedAt
                                        ? new Date(order.completedAt).toLocaleString()
                                        : "-"}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="OrderExtraInfo">

                        <div className="ExtraCard">
                            <span>Delivery Type</span>
                            <p>{order.deliveryType || "Standard"}</p>
                        </div>

                        <div className="ExtraCard">
                            <span>Delivery Time</span>
                            <p>{order.deliveryTime || "-"}</p>
                        </div>

                        <div className="ExtraCard">
                            <span>Coupon</span>
                            <p>{order.couponCode || "None"}</p>
                        </div>

                        <div className="ExtraCard">
                            <span>Discount</span>
                            <p>₹{order.discount || 0}</p>
                        </div>

                        <div className="ExtraCard">
                            <span>Delivery Charge</span>
                            <p>₹{order.deliveryCharge || 0}</p>
                        </div>

                        <div className="ExtraCard">
                            <span>Tip</span>
                            <p>₹{order.tip || 0}</p>
                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

};

export default UserOrderHistory;