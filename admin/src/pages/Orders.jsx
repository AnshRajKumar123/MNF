import { useEffect, useState, useRef } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService";
import "../styles/Orders.css";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";

// 🎛️ CUSTOM DISPATCH STATUS DROPDOWN COMPONENT
const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { label: "Pending", icon: "🟡", class: "Pending" },
        { label: "Preparing", icon: "🔵", class: "Preparing" },
        { label: "Out for Delivery", icon: "🟣", class: "OutforDelivery" },
        { label: "Delivered", icon: "🟢", class: "Delivered" },
        { label: "Cancelled", icon: "🔴", class: "Cancelled" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.label === currentStatus) || options[0];

    return (
        <div className="CustomStatusDropdown" ref={dropdownRef}>
            {/* Header Trigger Box */}
            <button
                type="button"
                className={`StatusDropdownTrigger ${selectedOption.class}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="TriggerLabel">
                    <span className="StatusEmoji">{selectedOption.icon}</span>
                    {selectedOption.label}
                </span>
                <i className={`bx bx-chevron-down DropChevron ${isOpen ? "rotate" : ""}`}></i>
            </button>

            {/* Floating Options Menu */}
            {isOpen && (
                <ul className="StatusDropdownMenu">
                    {options.map((opt) => (
                        <li
                            key={opt.label}
                            className={`StatusOptionItem ${opt.label === currentStatus ? "selected" : ""}`}
                            onClick={() => {
                                onStatusChange(opt.label);
                                setIsOpen(false);
                            }}
                        >
                            <span className="StatusEmoji">{opt.icon}</span>
                            <span>{opt.label}</span>
                            {opt.label === currentStatus && (
                                <i className="bx bx-check CheckIcon"></i>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateOrderStatus(id, {
                orderStatus: status,
            });
            loadOrders();
        } catch (error) {
            console.error(error);
            alert("Failed to update order status");
        }
    };

    // Dynamic Search & Filter Logic
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="OrdersLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Synchronizing Dispatch Ledger...</h2>
                <p>Retrieving active transactions from database</p>
            </div>
        );
    }

    return (
        <div className="OrdersPage">
            {/* TOP HEADER CONTROLS */}
            <div className="OrdersHeader">
                <div className="HeaderTitleGroup">
                    <h1>Order Dispatches</h1>
                    <p>Track real-time transactions, update delivery status, and review customer bills</p>
                </div>

                <div className="OrdersFilterActions">
                    {/* Status Filter Tab Pills */}
                    <div className="StatusFilterPills">
                        {["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map((status) => (
                            <button
                                key={status}
                                className={`FilterPill ${statusFilter === status ? "active" : ""}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search Field */}
                    <div className="SearchInputWrapper">
                        <i className="bx bx-search SearchIcon"></i>
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="SearchInput"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ORDERS TABLE */}
            <div className="TableContainer">
                <table className="OrdersTable">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Dispatch Status</th>
                            <th>Placed Date</th>
                            <th className="TextRight">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="EmptyTableMessage">
                                    <i className="bx bx-receipt"></i>
                                    <p>No orders found matching the filter criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <span className="OrderIdBadge">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="CustomerCell">
                                            <strong className="CustomerName">
                                                {order.user?.fullName || "Guest Customer"}
                                            </strong>
                                            <span className="CustomerItemsCount">
                                                {order.items?.length || 0} items ordered
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="OrderAmount">₹{order.totalAmount}</span>
                                    </td>

                                    <td>
                                        <span className="PaymentMethodTag">
                                            <i className="bx bx-credit-card-alt"></i> {order.paymentMethod}
                                        </span>
                                    </td>

                                    {/* CUSTOM DROPDOWN SELECTOR */}
                                    <td>
                                        <StatusDropdown
                                            currentStatus={order.orderStatus}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(order._id, newStatus)
                                            }
                                        />
                                    </td>

                                    <td>
                                        <span className="DateText">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>

                                    <td className="TextRight">
                                        <button
                                            className="ViewBtn"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setOpenModal(true);
                                            }}
                                        >
                                            <i className="bx bx-show"></i> Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ORDER DETAILS INSPECTION MODAL */}
            <OrderDetailsModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default Orders;