import "../../styles/OrderDetailsModal.css";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const statusClass = order.orderStatus.replace(/\s+/g, "");

    return (
        <div className="OrderOverlay" onClick={onClose}>
            <div className="OrderModal" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="OrderHeader">
                    <div className="HeaderTitleGroup">
                        <i className="bx bx-receipt HeaderIcon"></i>
                        <h2>Order Specification #{order._id.slice(-6).toUpperCase()}</h2>
                    </div>
                    <button className="CloseBtn" onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                {/* MODAL BENTO GRID CONTENT */}
                <div className="OrderContent">

                    {/* CUSTOMER CARD */}
                    <div className="Card CustomerCard">
                        <h3><i className="bx bx-user-circle"></i> Customer Profile</h3>
                        <div className="Customer">
                            {order.address?.image ? (
                                <img
                                    src={`http://10.59.92.183:3000${order.address.image}`}
                                    alt={order.address?.name}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/70?text=Avatar";
                                    }}
                                />
                            ) : (
                                <div className="DefaultAvatarShield">
                                    {order.address?.name ? order.address.name.charAt(0).toUpperCase() : "C"}
                                </div>
                            )}

                            <div className="CustomerMeta">
                                <h4>{order.address?.name || "Guest Customer"}</h4>
                                <p><i className="bx bx-phone"></i> {order.address?.phone || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* DELIVERY ADDRESS CARD */}
                    <div className="Card">
                        <h3><i className="bx bx-map-pin"></i> Delivery Address</h3>
                        <div className="MetaTextGroup">
                            <p><strong>Building / House:</strong> {order.address?.building || "N/A"}</p>
                            <p><strong>Street Address:</strong> {order.address?.address || "N/A"}</p>
                            <p><strong>Pincode:</strong> {order.address?.pincode || "N/A"}</p>
                        </div>
                    </div>

                    {/* ORDERED DISHES ITEM LIST */}
                    <div className="Card FullWidthCard">
                        <h3><i className="bx bx-dish"></i> Ordered Dishes ({order.items?.length || 0})</h3>
                        <div className="ItemsListStack">
                            {order.items?.map((item, index) => (
                                <div className="ItemRow" key={item._id || index}>
                                    <img
                                        src={`http://10.59.92.183:3000${item.product?.image}`}
                                        alt={item.product?.name}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/60?text=Dish";
                                        }}
                                    />
                                    <div className="ItemInfo">
                                        <h4>{item.product?.name || "Unknown Dish"}</h4>
                                        <small>Quantity: {item.quantity} × ₹{item.product?.price}</small>
                                    </div>
                                    <span className="ItemPriceTotal">
                                        ₹{(item.product?.price || 0) * (item.quantity || 1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FINANCIAL BILL BREAKDOWN */}
                    <div className="Card">
                        <h3><i className="bx bx-wallet"></i> Payment Summary</h3>
                        <div className="PriceBreakdown">
                            <div className="PriceRow">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal || order.totalAmount}</span>
                            </div>
                            <div className="PriceRow">
                                <span>Delivery Fee</span>
                                <span>₹{order.deliveryCharge || 0}</span>
                            </div>
                            <div className="PriceRow">
                                <span>Rider Tip</span>
                                <span>₹{order.tip || 0}</span>
                            </div>
                            <div className="PriceRow DiscountRow">
                                <span>Discount</span>
                                <span>-₹{order.discount || 0}</span>
                            </div>
                            <hr className="DividerLine" />
                            <div className="PriceRow TotalRow">
                                <span>Total Amount</span>
                                <span className="TotalVal">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* DISPATCH STATUS & TIME PARAMETERS */}
                    <div className="Card">
                        <h3><i className="bx bx-info-circle"></i> Dispatch Parameters</h3>
                        <div className="MetaTextGroup">
                            <p>
                                <strong>Status:</strong>
                                <span className={`OrderStatusBadge ${statusClass}`}>
                                    {order.orderStatus}
                                </span>
                            </p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                            <p><strong>Delivery Type:</strong> {order.deliveryType || "Standard"}</p>
                            <p><strong>Coupon Applied:</strong> {order.couponCode || "None"}</p>
                            <p><strong>Ordered Date:</strong> {new Date(order.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;