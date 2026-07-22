import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/TrackOrder.css";
import { midnightTrackingData } from "../assets/assest";
import api from "../config/axios";
import axios from "axios";


const TrackOrder = () => {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = midnightTrackingData?.steps || [
        "Order Confirmed",
        "Preparing Order",
        "Rider Assigned",
        "Out for Delivery",
        "Delivered"
    ];

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/order/${orderId}`);
            setOrder(data.order);
        } catch (error) {
            console.log(error);
        }
    };


    // 🔄 Fetch Order Polling Engine
    useEffect(() => {
        if (!orderId) return;

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    // ⏱️ Real-time Countdown Timer
    useEffect(() => {
        if (!order) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const delivery = new Date(order.estimatedDelivery).getTime();
            setTimeLeft(Math.max(0, delivery - now));
        }, 1000);

        return () => clearInterval(timer);
    }, [order]);

    // 📊 Dynamic Progress Fill Calculator
    useEffect(() => {
        if (!order) return;

        const timer = setInterval(() => {
            const created = new Date(order.createdAt).getTime();
            const delivery = new Date(order.estimatedDelivery).getTime();
            const now = Date.now();

            const total = delivery - created;
            const elapsed = now - created;
            const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));

            if (order.orderStatus === "Delivered") {
                setProgress(100);
            } else {
                setProgress(percent);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [order]);

    // 🎯 Active Step Node Evaluator
    useEffect(() => {
        if (order?.orderStatus === "Delivered") {
            setCurrentStep(4);
            return;
        }

        if (progress < 20) {
            setCurrentStep(0);
        } else if (progress < 45) {
            setCurrentStep(1);
        } else if (progress < 75) {
            setCurrentStep(2);
        } else if (progress < 100) {
            setCurrentStep(3);
        } else {
            setCurrentStep(4);
        }
    }, [progress, order]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const cancelOrder = async () => {
        try {
            await api.patch(`/order/cancel/${order._id}`);
            setOrder(prev => ({
                ...prev,
                orderStatus: "Cancelled",
            }));
        } catch (error) {
            console.error("Order cancellation failure:", error);
        }
    };

    if (!order) {
        return (
            <div className="ProTrackingOuterSuite">
                <AnotherNav />
                <div className="TrackLoadingState">
                    <div className="TrackLoadingSpinner">
                        <i className='bx bx-radar bx-spin'></i>
                    </div>
                    <h2>Synchronizing Dispatch Telemetry...</h2>
                    <p>Fetching active route coordinates from server grid</p>
                </div>
            </div>
        );
    }

    const payOnlineNow = async () => {

        try {

            const { data } = await axios.post(
                "http://localhost:3000/payment/create-order",
                {
                    amount: order.totalAmount
                },
                {
                    withCredentials: true
                }
            );

            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: data.order.amount,

                currency: "INR",

                name: "MidNight Food",

                description: "Pay for existing order",

                order_id: data.order.id,

                handler: async function (response) {

                    const verify = await axios.post(
                        "http://localhost:3000/payment/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        },
                        {
                            withCredentials: true
                        }
                    );

                    if (!verify.data.success) {
                        alert("Payment Failed");
                        return;
                    }

                    await axios.post(
                        "http://localhost:3000/payment/pay-existing-order",
                        {
                            orderId: order._id
                        },
                        {
                            withCredentials: true
                        }
                    );

                    await fetchOrder();

                    alert("Payment Successful");

                }

            };

            const razor = new window.Razorpay(options);

            razor.open();

        } catch (err) {

            console.log(err);

        }

    };


    const downloadInvoice = async () => {
        try {

            const response = await api.get(`/invoice/${order._id}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");

            link.href = url;
            link.download = `Invoice-${order._id}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(error);
            alert("Failed to download invoice");
        }
    };

    return (
        <div className="ProTrackingOuterSuite">
            <AnotherNav />

            <section className="ProTrackingSectionLayout">

                {/* ================= HEADER CONTROL BAR ================= */}
                <header className="ProTrackHeaderBar">
                    <div className="HeaderTitleGroup">
                        <span className="ProTaglineSectionText">Dispatch Operations Console</span>
                        <h1>Live Order Tracking</h1>
                        <p className="OrderIdPill">Node Signature: <strong>#{order._id}</strong></p>
                    </div>

                    <div className="HeaderStatusBadgeGroup">
                        <span className={`ProOrderStatusBadge ${order.orderStatus.replace(/\s/g, "")}`}>
                            <span className="StatusPulseDot"></span>
                            {order.orderStatus}
                        </span>
                    </div>
                </header>

                {/* ================= COMMAND BENTO GRID ================= */}
                <div className="ProTrackingDashboardBentoGrid">

                    {/* ---------- LEFT COLUMN: TIMELINE & COUNTDOWN ---------- */}
                    <div className="ProBentoColumn PrimaryTimelineColumn">

                        {/* COUNTDOWN TIMER CARD */}
                        <div className="ProBentoCard CountdownTelemetryCard">
                            <div className="CardHeaderTag">
                                <i className='bx bx-stopwatch'></i>
                                <span>Time-to-Destination</span>
                            </div>

                            <h1 className="CountdownDigitalDisplay">
                                {order.orderStatus === "Delivered" ? "DELIVERED" : formatTime(timeLeft)}
                            </h1>

                            <div className="TargetDeliveryMetaRow">
                                <span>Estimated Dispatch Arrival:</span>
                                <strong>
                                    {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </strong>
                            </div>
                        </div>

                        {/* STEPPER PROGRESS TIMELINE */}
                        <div className="ProBentoCard StepperTimelineCard">
                            <h3 className="CardTitleText">Logistics Milestones</h3>

                            <div className="ProVerticalStepperTrack">
                                <div className="VerticalTrackLine">
                                    <div
                                        className="VerticalFillProgress"
                                        style={{ height: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="ProVerticalStepsStack">
                                    {steps.map((step, index) => {
                                        const isCompleted = index < currentStep;
                                        const isActive = index === currentStep;
                                        const isLastStep = index === steps.length - 1;

                                        return (
                                            <div
                                                key={index}
                                                className={`ProStepRowNode ${isCompleted ? "node-completed" : ""} ${isActive ? "node-active" : ""}`}
                                            >
                                                <div className="StepCircleIconShield">
                                                    {isCompleted ? (
                                                        <i className="bx bx-check"></i>
                                                    ) : (
                                                        <span>{index + 1}</span>
                                                    )}
                                                    {isActive && <span className="StepActivePulseGlow"></span>}
                                                </div>

                                                <div className="StepTextCluster">
                                                    <span className="StepNodeLabel">{step}</span>

                                                    {/* DYNAMIC STEP NOTICE: Displays "Completed" on final step, else "In Progress..." */}
                                                    {isActive && (
                                                        <small className={`ActiveStepNotice ${isLastStep ? "NoticeCompleted" : ""}`}>
                                                            {isLastStep ? "Completed" : "In Progress..."}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------- RIGHT COLUMN: ORDER SUMMARY & DISPATCH INFO ---------- */}
                    <div className="ProBentoColumn SecondarySummaryColumn">

                        {/* ITEM SUMMARY LEDGER */}
                        <div className="ProBentoCard SummaryLedgerCard">
                            <h3 className="CardTitleText">Item Ledger Summary</h3>

                            <div className="ItemsScrollViewStack">
                                {order.items.map((item) => (
                                    <div className="ProOrderItemRowCard" key={item._id}>
                                        <div className="ItemImageThumbFrame">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.name}
                                            />
                                        </div>

                                        <div className="ItemDetailMeta">
                                            <h4>{item.product?.name}</h4>
                                            <span className="QtyBadge">Qty: {item.quantity}</span>
                                        </div>

                                        <strong className="ItemRowRate">
                                            ₹{(item.product?.price || 0) * item.quantity}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div className="ProSummaryCostBreakdown">

                                <div className="CostRow">
                                    <span>Subtotal</span>
                                    <strong>
                                        ₹{order.subtotal ?? order.items.reduce(
                                            (sum, item) => sum + item.price * item.quantity,
                                            0
                                        )}
                                    </strong>
                                </div>

                                {order.discount > 0 && (
                                    <div className="CostRow">
                                        <span>
                                            Coupon ({order.couponCode})
                                        </span>
                                        <strong>-₹{order.discount}</strong>
                                    </div>
                                )}

                                <div className="CostRow">
                                    <span>Delivery Charge</span>
                                    <strong>
                                        {order.deliveryCharge === 0
                                            ? "FREE"
                                            : `₹${order.deliveryCharge}`}
                                    </strong>
                                </div>

                                {order.tip > 0 && (
                                    <div className="CostRow">
                                        <span>Delivery Tip</span>
                                        <strong>₹{order.tip}</strong>
                                    </div>
                                )}

                                <div className="CostRow TotalAmountRow">
                                    <span>Total Paid</span>
                                    <strong>₹{order.totalAmount}</strong>
                                </div>

                            </div>
                        </div>

                        {/* DISPATCH ADDRESS & PAYMENT INFO */}
                        <div className="ProBentoCard MetadataInfoCard">
                            <div className="InfoMetaBlock">
                                <h3><i className='bx bx-map-pin'></i> Target Address</h3>
                                <p>
                                    {order.address?.building}, {order.address?.address}, {order.address?.pincode}
                                </p>
                            </div>

                            <div className="InfoMetaBlock">
                                <h3><i className='bx bx-credit-card-alt'></i> Settlement Method</h3>
                                <div className="PaymentPillsFlex">
                                    <span className="MethodPill">{order.paymentMethod}</span>
                                    <span className="TypePill">{order.deliveryType} Delivery</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* ================= BOTTOM TELEMETRY STATUS DECKS & ACTION DOCK ================= */}
                <div className="ProTrackingBottomStatusSection">

                    {/* RIDER TELEMETRY CARD */}
                    {order.orderStatus === "On Process" && order.rider && (
                        <div className="ProBentoCard RiderConsoleCard">
                            <div className="RiderAvatarShield">
                                <img src={order.rider.image} alt={order.rider.name} />
                            </div>

                            <div className="RiderMetaDetails">
                                <span className="RiderRoleTag"><i className='bx bx-cycling'></i> Assigned Delivery Operator</span>
                                <h3>{order.rider.name}</h3>
                                <p>Vehicle: <strong>{order.rider.vehicle}</strong></p>
                            </div>

                            <a href={`tel:${order.rider.phone}`} className="RiderContactCTA">
                                <i className='bx bx-phone-call'></i> Call Operator
                            </a>
                        </div>
                    )}

                    {/* ESTIMATED ARRIVAL BANNER */}
                    {order.orderStatus === "On Process" && (
                        <div className="ProBentoCard EtaNoticeAlertCard">
                            <div className="AlertIconShield">
                                <i className="bx bx-time-five"></i>
                            </div>
                            <div className="AlertTextCluster">
                                <h3>Estimated Arrival Target</h3>
                                <p>Transit payload arriving in <strong>{formatTime(timeLeft)}</strong></p>
                            </div>
                        </div>
                    )}

                    {/* DELIVERED SUCCESS BANNER */}
                    {order.orderStatus === "Delivered" && (
                        <div className="ProBentoCard DeliverySuccessAlertCard">
                            <div className="SuccessBadgeShieldIcon">
                                <i className="bx bx-badge-check"></i>
                            </div>
                            <div className="SuccessTextCluster">
                                <h3>Dispatch Protocol Completed</h3>
                                <p>Package verified and delivered to designated coordinates.</p>
                                {order.completedAt && (
                                    <small>Timestamp: {new Date(order.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CANCELLED BANNER */}
                    {order.orderStatus === "Cancelled" && (
                        <div className="ProBentoCard OrderCancelledAlertCard">
                            <div className="CancelledIconShield">
                                <i className="bx bx-x-circle"></i>
                            </div>
                            <div className="CancelledTextCluster">
                                <h3>Order Terminated</h3>
                                <p>{order.cancelReason || "The dispatch sequence was manually cancelled."}</p>
                            </div>
                        </div>
                    )}

                    {/* ================= UNIFIED ACTION BUTTON DOCK ================= */}
                    <div className="ProActionControlsDock">

                        {order.orderStatus !== "Cancelled" && order.paymentMethod === "COD" && order.paymentStatus === "Pending" && (
                            <button className="ProActionCTA PayOnlineBtn" onClick={payOnlineNow}>
                                <i className='bx bx-credit-card-front'></i> Pay Online Now
                            </button>
                        )}

                        {order.orderStatus !== "Cancelled" && (
                            <button
                                className="ProActionCTA DownloadInvoiceBtn"
                                onClick={downloadInvoice}
                            >
                                <i className='bx bx-download'></i>
                                Download Invoice PDF
                            </button>
                        )}

                        {order.orderStatus === "On Process" && (
                            <button className="ProActionCTA ProCancelOrderTriggerCTA" onClick={cancelOrder}>
                                <i className='bx bx-block'></i> Terminate Order
                            </button>
                        )}

                    </div>

                </div>

            </section>
        </div>
    );
};

export default TrackOrder;