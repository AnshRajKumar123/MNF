import Button from "../ui/Button";
import UserProfileHeader from "./UserProfileHeader";
import UserStats from "./UserStats";
import UserAddress from "./UserAddress";
import UserOrderHistory from "./UserOrderHistory";

const UserDetailsModal = ({ open, onClose, data }) => {
    if (!open || !data) return null;

    const { user, orders, totalOrders, totalSpent } = data;

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="UserDetailsModal" onClick={(e) => e.stopPropagation()}>
                <div className="ModalHeader">
                    <div className="ModalHeaderTitle">
                        <i className="bx bx-id-card HeaderIcon"></i>
                        <h2>User Inspection Profile</h2>
                    </div>

                    <button className="CloseModalBtn" onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                <div className="ModalBodyScroll">
                    <UserProfileHeader user={user} />
                    <UserStats user={user} totalOrders={totalOrders} totalSpent={totalSpent} />
                    <UserAddress user={user} />
                    <UserOrderHistory orders={orders} />
                </div>

                <div className="ModalFooter">
                    <button className="CloseProfileBtn" onClick={onClose}>
                        Close Inspection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;