import "../../styles/OrderDetailsModal.css";

const OrderDetailsModal = ({
    isOpen,
    onClose,
    order,
}) => {

    if (!isOpen || !order) return null;

    return (

        <div className="OrderOverlay">

            <div className="OrderModal">

                <div className="OrderHeader">

                    <h2>
                        🍽 Order #{order._id.slice(-6)}
                    </h2>

                    <button
                        className="CloseBtn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="OrderContent">

                    {/* Customer */}

                    <div className="Card">

                        <h3>👤 Customer</h3>

                        <div className="Customer">

                            <img
                                src={`http://10.59.92.183:3000${order.address.image}`}
                                alt=""
                            />

                            <div>

                                <h4>{order.address.name}</h4>

                                <p>{order.address.phone}</p>

                            </div>

                        </div>

                    </div>

                    {/* Address */}

                    <div className="Card">

                        <h3>📍 Delivery Address</h3>

                        <p>
                            <strong>Building :</strong>{" "}
                            {order.address.building}
                        </p>

                        <p>
                            <strong>Address :</strong>{" "}
                            {order.address.address}
                        </p>

                        <p>
                            <strong>Pincode :</strong>{" "}
                            {order.address.pincode}
                        </p>

                    </div>

                    {/* Items */}

                    <div className="Card">

                        <h3>🍔 Ordered Items</h3>

                        {order.items.map((item) => (

                            <div
                                className="ItemRow"
                                key={item._id}
                            >

                                <img
                                    src={`http://10.59.92.183:3000${item.product.image}`}
                                    alt=""
                                />

                                <div className="ItemInfo">

                                    <h4>{item.product.name}</h4>

                                    <small>
                                        Qty : {item.quantity}
                                    </small>

                                </div>

                                <span>
                                    ₹{item.product.price * item.quantity}
                                </span>

                            </div>

                        ))}

                    </div>

                    {/* Summary */}

                    <div className="Card">

                        <h3>💰 Payment Summary</h3>

                        <div className="PriceRow">

                            <span>Subtotal</span>

                            <span>
                                ₹{order.subtotal}
                            </span>

                        </div>

                        <div className="PriceRow">

                            <span>Delivery</span>

                            <span>
                                ₹{order.deliveryCharge}
                            </span>

                        </div>

                        <div className="PriceRow">

                            <span>Tip</span>

                            <span>
                                ₹{order.tip}
                            </span>

                        </div>

                        <div className="PriceRow">

                            <span>Discount</span>

                            <span>
                                ₹{order.discount}
                            </span>

                        </div>

                        <hr />

                        <div className="PriceRow Total">

                            <span>Total</span>

                            <span>
                                ₹{order.totalAmount}
                            </span>

                        </div>

                    </div>

                    {/* Payment */}

                    <div className="Card">

                        <h3>💳 Payment</h3>

                        <p>
                            <strong>Method :</strong>{" "}
                            {order.paymentMethod}
                        </p>

                        <p>
                            <strong>Status :</strong>{" "}
                            {order.paymentStatus}
                        </p>

                    </div>

                    {/* Delivery */}

                    <div className="Card">

                        <h3>🚚 Delivery</h3>

                        <p>
                            <strong>Type :</strong>{" "}
                            {order.deliveryType}
                        </p>

                        <p>
                            <strong>Time :</strong>{" "}
                            {order.deliveryMinutes} min
                        </p>

                        <p>
                            <strong>Estimated :</strong>{" "}
                            {new Date(
                                order.estimatedDelivery
                            ).toLocaleString()}
                        </p>

                    </div>

                    {/* Order */}

                    <div className="Card">

                        <h3>📦 Order</h3>

                        <p>
                            <strong>Status :</strong>

                            <span className={`OrderStatus ${order.orderStatus.replace(/\s+/g, "")}`}>
                                {order.orderStatus}
                            </span>
                        </p>

                        <p>
                            <strong>Coupon :</strong>{" "}
                            {order.couponCode || "None"}
                        </p>

                        <p>
                            <strong>Created :</strong>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default OrderDetailsModal;