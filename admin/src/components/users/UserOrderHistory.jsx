import React from "react";

const UserOrderHistory = ({ orders }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
            case "On Process":
                return "StatusPending";
            case "Preparing":
                return "StatusPreparing";
            case "Out for Delivery":
            case "Out For Delivery":
                return "StatusDelivery";
            case "Delivered":
                return "StatusDelivered";
            case "Cancelled":
                return "StatusCancelled";
            default:
                return "";
        }
    };

    if (!orders || !orders.length) {
        return (
            <div className="UserOrderHistory">
                <h3>
                    <i className="bx bx-receipt"></i> Order Dispatches History
                </h3>
                <div className="NoOrdersBox">
                    <i className="bx bx-package"></i>
                    <p>This user has not placed any food dispatch orders yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="UserOrderHistory">
            <h3>
                <i className="bx bx-receipt"></i> Order Dispatches History ({orders.length})
            </h3>

            {orders.map((order) => (
                <div key={order._id} className="OrderCard">
                    <div className="OrderHeader">
                        <div>
                            <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                            <small>{new Date(order.createdAt).toLocaleString("en-IN")}</small>
                        </div>

                        <span className={`OrderStatus ${getStatusClass(order.orderStatus)}`}>
                            <span className="StatusPulseDot"></span>
                            {order.orderStatus}
                        </span>
                    </div>

                    <div className="OrderDetails">
                        <div className="OrderInfoBox">
                            <span>Subtotal</span>
                            <p>₹{order.subtotal || order.totalAmount}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Discount</span>
                            <p className="DiscountText">- ₹{order.discount || 0}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Delivery Fee</span>
                            <p>₹{order.deliveryCharge || 0}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Rider Tip</span>
                            <p>₹{order.tip || 0}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Total Billed</span>
                            <p className="TotalAmountVal">₹{order.totalAmount}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Payment Method</span>
                            <p>{order.paymentMethod}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Payment Status</span>
                            <p>{order.paymentStatus}</p>
                        </div>

                        <div className="OrderInfoBox">
                            <span>Coupon Used</span>
                            <p>{order.couponCode || "None"}</p>
                        </div>
                    </div>

                    {/* ORDERED DISHES ITEM ROW */}
                    <div className="OrderItems">
                        <h5>Dishes Ordered ({order.items?.length || 0})</h5>

                        {order.items?.map((item, index) => {
                            const product = item.product;
                            const backendURL = import.meta.env.VITE_API_URL;
                            const image = product?.image
                                ? `${backendURL}/${product.image.replace(/^\/+/, "")}`
                                : "https://via.placeholder.com/80?text=Dish";

                            return (
                                <div key={index} className="OrderItem">
                                    <img
                                        src={image}
                                        alt={product?.name}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/80?text=Dish";
                                        }}
                                    />

                                    <div className="ItemInfo">
                                        <h6>{product?.name || "Deleted Dish"}</h6>
                                        <span>Category: {product?.category || "Standard"}</span>
                                    </div>

                                    <div className="ItemMeta">
                                        <span>Quantity: {item.quantity}</span>
                                        <span className="ItemPrice">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserOrderHistory;