import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/OrderHistory.css";
import api from "../config/axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/order/my-orders");
            setOrders(data.orders);
        } catch (err) {
            console.error("Failed to retrieve order history:", err);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/invoice/${orderId}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice-${orderId}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Invoice download exception:", err);
            alert("Unable to download invoice.");
        }
    };

    const deleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("Purge this order from history ledger?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/order/${orderId}`);
            setOrders((prev) => prev.filter((order) => order._id !== orderId));
        } catch (err) {
            console.error("Order deletion failure:", err);
            alert("Failed to delete order from ledger.");
        }
    };

    // 📊 Filter Logic & Dynamic Order Counts Calculation
    const getFilteredOrders = () => {
        if (activeFilter === "All") return orders;
        return orders.filter((order) => {
            if (activeFilter === "On Process") {
                return order.orderStatus === "On Process" || order.orderStatus === "Processing";
            }
            return order.orderStatus === activeFilter;
        });
    };

    const countAll = orders.length;
    const countOnProcess = orders.filter((o) => o.orderStatus === "On Process" || o.orderStatus === "Processing").length;
    const countDelivered = orders.filter((o) => o.orderStatus === "Delivered").length;
    const countCancelled = orders.filter((o) => o.orderStatus === "Cancelled").length;

    const filteredOrders = getFilteredOrders();

    if (loading) {
        return (
            <div className="ProHistoryOuterSuite">
                <AnotherNav />
                <div className="OrderHistoryLoading">
                    <div className="TrackLoadingSpinner">
                        <i className='bx bx-radar bx-spin'></i>
                    </div>
                    <h2>Synchronizing Order History Ledger...</h2>
                    <p>Fetching past dispatches from server grid</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ProHistoryOuterSuite">
            <AnotherNav />

            <section className="ProHistorySectionLayout">
                {/* Header Control Panel */}
                <header className="ProHistoryHeaderBar">
                    <div className="HeaderTitleGroup">
                        <span className="ProTaglineSectionText">User Operations Console</span>
                        <h1>Order History Ledger</h1>
                        <p>View, track, and manage all your past and active food dispatches</p>
                    </div>
                </header>

                {/* 🎛️ DASHBOARD FILTER TABS BAR */}
                <div className="ProHistoryDashboardTabsRow">
                    <button
                        className={`DashboardTabBtn ${activeFilter === "All" ? "tab-active" : ""}`}
                        onClick={() => setActiveFilter("All")}
                    >
                        <i className='bx bx-layer'></i> All
                        <span className="TabCountBadge">{countAll}</span>
                    </button>

                    <button
                        className={`DashboardTabBtn ${activeFilter === "On Process" ? "tab-active" : ""}`}
                        onClick={() => setActiveFilter("On Process")}
                    >
                        <i className='bx bx-loader-circle'></i> On Process
                        <span className="TabCountBadge">{countOnProcess}</span>
                    </button>

                    <button
                        className={`DashboardTabBtn ${activeFilter === "Delivered" ? "tab-active" : ""}`}
                        onClick={() => setActiveFilter("Delivered")}
                    >
                        <i className='bx bx-check-circle'></i> Delivered
                        <span className="TabCountBadge">{countDelivered}</span>
                    </button>

                    <button
                        className={`DashboardTabBtn ${activeFilter === "Cancelled" ? "tab-active" : ""}`}
                        onClick={() => setActiveFilter("Cancelled")}
                    >
                        <i className='bx bx-x-circle'></i> Cancelled
                        <span className="TabCountBadge">{countCancelled}</span>
                    </button>
                </div>

                {/* Empty State vs Filtered Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="ProEmptyOrdersBentoCard">
                        <div className="EmptyIconShield">
                            <i className='bx bx-receipt'></i>
                        </div>
                        <h2>No Dispatches Found</h2>
                        <p>
                            {orders.length === 0
                                ? "Place your first order to populate your history ledger."
                                : `No orders found matching the "${activeFilter}" status.`}
                        </p>
                        <Link to="/mainWebsite" className="ProEmptyExploreCTA">
                            Explore Menu <i className='bx bx-right-arrow-alt'></i>
                        </Link>
                    </div>
                ) : (
                    <div className="ProOrderGridStack">
                        {filteredOrders.map((order) => {
                            const primaryProduct = order.items[0]?.product;
                            const hasMultipleItems = order.items.length > 1;

                            return (
                                <div className="ProOrderBentoCard" key={order._id}>
                                    
                                    {/* Left Image Shield */}
                                    <div className="OrderImageShieldFrame">
                                        <img
                                            src={primaryProduct?.image}
                                            alt={primaryProduct?.name}
                                            loading="lazy"
                                        />
                                        {hasMultipleItems && (
                                            <span className="PlusMoreBadge">
                                                +{order.items.length - 1} More
                                            </span>
                                        )}
                                    </div>

                                    {/* Middle Content Metadata */}
                                    <div className="OrderMetaBodyDetails">
                                        <div className="OrderTitleHeaderRow">
                                            <h2 className="OrderTitleText">
                                                {primaryProduct?.name || "Dispatch Items"}
                                            </h2>
                                            <span className="OrderNodeIdPill">#{order._id}</span>
                                        </div>

                                        {/* Structured Key Meta Pills Row */}
                                        <div className="MetaPillsFlexRow">
                                            <span className="MetaPill">
                                                <i className='bx bx-shopping-bag'></i> {order.items.length} Items
                                            </span>
                                            <span className="MetaPill HighlightAmount">
                                                ₹{order.totalAmount}
                                            </span>
                                            <span className="MetaPill">
                                                <i className='bx bx-time-five'></i>{" "}
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}{" "}
                                                •{" "}
                                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="MetaPillsFlexRow SecondaryMetaRow">
                                            <span className="SubMetaItem">
                                                <i className='bx bx-cycling'></i> {order.deliveryType} Delivery
                                            </span>
                                            <span className="SubMetaItem">
                                                <i className='bx bx-credit-card-alt'></i> {order.paymentMethod} ({order.paymentStatus})
                                            </span>
                                            {order.couponCode && (
                                                <span className="SubMetaItem CouponTag">
                                                    <i className='bx bx-purchase-tag-alt'></i> {order.couponCode}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side Status & Actions */}
                                    <div className="OrderRightActionDock">
                                        <span
                                            className={`ProOrderStatusBadge ${
                                                order.orderStatus === "Delivered"
                                                    ? "Delivered"
                                                    : order.orderStatus === "Cancelled"
                                                    ? "Cancelled"
                                                    : "OnProcess"
                                            }`}
                                        >
                                            <span className="StatusPulseDot"></span>
                                            {order.orderStatus}
                                        </span>

                                        <div className="ProHistoryActionsGroup">
                                            <Link
                                                to={`/track-order/${order._id}`}
                                                className="HistoryActionBtn TrackBtn"
                                            >
                                                <i className="bx bx-map-pin"></i> Track
                                            </Link>

                                            {order.orderStatus !== "Cancelled" && (
                                                <button
                                                    className="HistoryActionBtn InvoiceBtn"
                                                    onClick={() => downloadInvoice(order._id)}
                                                >
                                                    <i className="bx bx-download"></i> Invoice
                                                </button>
                                            )}

                                            {(order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") && (
                                                <button
                                                    className="HistoryActionBtn DeleteBtn"
                                                    onClick={() => deleteOrder(order._id)}
                                                >
                                                    <i className="bx bx-trash"></i> Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrderHistory;