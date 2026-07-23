import Button from "../ui/Button";

const UserDetailsModal = ({
    open,
    onClose,
    data,
}) => {

    if (!open || !data) return null;

    const { user, orders, totalOrders, totalSpent } = data;

    const backendURL = import.meta.env.VITE_API_URL;

    const imageUrl = user.image
        ? `${backendURL}/${user.image.replace(/^\/+/, "")}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.fullName
          )}`;

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "StatusDelivered";

            case "Preparing":
                return "StatusPreparing";

            case "Out For Delivery":
                return "StatusDelivery";

            case "Cancelled":
                return "StatusCancelled";

            default:
                return "StatusPending";
        }
    };

    return (
        <div className="ModalOverlay">

            <div className="UserDetailsModal">

                <div className="ModalHeader">

                    <h2>User Details</h2>

                    <button
                        className="CloseModalBtn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="UserInfo">

                    <img
                        src={imageUrl}
                        alt={user.fullName}
                        className="UserAvatarLarge"
                    />

                    <h2>{user.fullName}</h2>

                    <p>{user.email}</p>

                </div>

                <div className="UserStats">

                    <div>
                        <span>Total Orders</span>
                        <h2>{totalOrders}</h2>
                    </div>

                    <div>
                        <span>Total Spent</span>
                        <h2>₹{totalSpent.toFixed(2)}</h2>
                    </div>

                    <div>
                        <span>Joined</span>
                        <h2>
                            {new Date(user.createdAt).toLocaleDateString()}
                        </h2>
                    </div>

                </div>

                <h3 className="OrderHistoryTitle">
                    Order History
                </h3>

                <div className="OrderHistory">

                    {orders.length === 0 ? (

                        <p>No orders found.</p>

                    ) : (

                        orders.map((order) => (

                            <div
                                key={order._id}
                                className="OrderCard"
                            >

                                <div className="OrderTop">

                                    <div>
                                        <h4>
                                            Order #{order._id.slice(-8)}
                                        </h4>

                                        <small>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </small>
                                    </div>

                                    <span
                                        className={`OrderStatus ${getStatusClass(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus}
                                    </span>

                                </div>

                                <div className="OrderGrid">

                                    <div>
                                        <span>Total</span>
                                        <strong>
                                            ₹{order.totalAmount}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Payment</span>
                                        <strong>
                                            {order.paymentMethod}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Payment Status</span>
                                        <strong>
                                            {order.paymentStatus}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Items</span>
                                        <strong>
                                            {order.items.length}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                <div className="ModalFooter">

                    <Button
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </div>

            </div>

        </div>
    );
};

export default UserDetailsModal;