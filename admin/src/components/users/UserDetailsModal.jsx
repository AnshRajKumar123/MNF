import Button from "../ui/Button";
import UserProfileHeader from "./UserProfileHeader";
import UserStats from "./UserStats";
import UserAddress from "./UserAddress";
import UserOrderHistory from "./UserOrderHistory";

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
            case "On Process":
                return "StatusPending";

            case "Preparing":
                return "StatusPreparing";

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

                <UserProfileHeader user={user} />

                <UserStats user={user} totalOrders={totalOrders} totalSpent={totalSpent} />

                <UserAddress user={user} />

                <UserOrderHistory orders={orders} />

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