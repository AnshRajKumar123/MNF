import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/TrackOrder.css";
import { midnightTrackingData } from "../assets/assest";
import api from "../config/axios";

const TrackOrder = () => {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = midnightTrackingData.steps;

    useEffect(() => {

        if (!orderId) return;

        const fetchOrder = async () => {

            try {

                const { data } = await api.get(`/order/${orderId}`);

                setOrder(data.order);

            } catch (error) {

                console.log(error);

            }

        };

        fetchOrder();

        const interval = setInterval(fetchOrder, 5000);

        return () => clearInterval(interval);

    }, [orderId]);

    useEffect(() => {

        if (!order) return;

        const timer = setInterval(() => {

            const now = Date.now();

            const delivery = new Date(order.estimatedDelivery).getTime();

            setTimeLeft(Math.max(0, delivery - now));

        }, 1000);

        return () => clearInterval(timer);

    }, [order]);

    useEffect(() => {

        if (!order) return;

        const timer = setInterval(() => {

            const created = new Date(order.createdAt).getTime();

            const delivery = new Date(order.estimatedDelivery).getTime();

            const now = Date.now();

            const total = delivery - created;

            const elapsed = now - created;

            const percent = Math.min(
                100,
                Math.max(0, (elapsed / total) * 100)
            );

            if (order.orderStatus === "Delivered") {

                setProgress(100);

            } else {

                setProgress(percent);

            }

        }, 1000);

        return () => clearInterval(timer);

    }, [order]);

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

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;

    };

    const cancelOrder = async () => {

        try {

            await api.patch(`/order/cancel/${order._id}`);

            setOrder(prev => ({
                ...prev,
                orderStatus: "Cancelled",
            }));

        } catch (error) {

            console.log(error);

        }

    };

    if (!order) {

        return (
            <>
                <AnotherNav />

                <div className="TrackLoading">

                    <h2>Loading Order...</h2>

                </div>
            </>
        );

    }

    return (
        <div className="ProTrackingOuterSuite">

            <AnotherNav />

            <section className="ProTrackingSectionLayout">

                <header className="TrackHeader">

                    <div>

                        <h1>Track Order</h1>

                        <p>Order #{order._id}</p>

                    </div>

                    <span
                        className={`OrderStatusBadge ${order.orderStatus.replace(/\s/g, "")}`}
                    >
                        {order.orderStatus}
                    </span>

                </header>

                <div className="OrderSummaryCard">

                    <h2>Order Summary</h2>

                    {order.items.map((item) => (
                        <div className="OrderItemRow" key={item._id}>

                            <div className="OrderItemLeft">

                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="OrderProductImage"
                                />

                                <div className="OrderProductInfo">
                                    <h4>{item.product.name}</h4>
                                    <span>Qty : {item.quantity}</span>
                                </div>

                            </div>

                            <strong>₹{item.product.price * item.quantity}</strong>

                        </div>
                    ))}


                    <div className="SummaryRow">

                        <span>Delivery Charge</span>

                        <strong>

                            ₹{order.deliveryCharge}

                        </strong>

                    </div>

                    <div className="SummaryRow Total">

                        <span>Total</span>

                        <strong>

                            ₹{order.totalAmount}

                        </strong>

                    </div>

                </div>

                <div className="CountdownCard">

                    <h3>

                        Remaining Time

                    </h3>

                    <h1>

                        {order.orderStatus === "Delivered"
                            ? "Delivered"
                            : formatTime(timeLeft)}

                    </h1>

                    <p>

                        Estimated Delivery

                    </p>

                    <span>

                        {new Date(order.estimatedDelivery).toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}

                    </span>

                </div>

                <div className="ProHorizontalStepperContainer">

                    <div className="HorizontalTimelineTrackLine">

                        <div
                            className="TimelineTrackProgressFill"
                            style={{
                                width: `${progress}%`,
                            }}
                        ></div>

                    </div>

                    <div className="ProHorizontalStepsFlexRow">

                        {steps.map((step, index) => {

                            const isCompleted = index < currentStep;

                            const isActive = index === currentStep;

                            return (

                                <div
                                    key={index}
                                    className={`ProStepNodeCell ${isCompleted ? "cell-completed" : ""} ${isActive ? "cell-active" : ""}`}
                                >

                                    <div className="StepNodeCircleShield">

                                        {isCompleted ? (

                                            <i className="bx bx-check"></i>

                                        ) : (

                                            <span>

                                                {index + 1}

                                            </span>

                                        )}

                                        {isActive && (
                                            <span className="StepNodeActivePulseNode"></span>
                                        )}

                                    </div>

                                    <p className="StepNodeTextLabel">

                                        {step}

                                    </p>

                                </div>

                            );

                        })}

                    </div>

                </div>
                <div className="ProTrackingBentoStatusDeck">

                    {order.orderStatus === "On Process" && (

                        <div className="RiderCard">

                            <img
                                src={order.rider.image}
                                alt={order.rider.name}
                            />

                            <div className="RiderInfo">

                                <h3>{order.rider.name}</h3>

                                <p>{order.rider.vehicle}</p>

                                <span>{order.rider.phone}</span>

                            </div>

                        </div>

                    )}

                    <div className="InfoGrid">

                        <div className="InfoCard">

                            <h3>Delivery Address</h3>

                            <p>
                                {order.address.building}, {order.address.address},
                                {order.address.pincode}
                            </p>

                        </div>

                        <div className="InfoCard">

                            <h3>Payment Method</h3>

                            <p>{order.paymentMethod}</p>

                            <span>{order.deliveryType} Delivery</span>

                        </div>

                    </div>

                    {order.orderStatus === "On Process" && (

                        <div className="ProArrivalEtaNoticeCard">

                            <div className="EtaAlertIconBox">

                                <i className="bx bx-time-five"></i>

                            </div>

                            <div className="EtaAlertTextCluster">

                                <h3>Estimated Arrival</h3>

                                <p>{formatTime(timeLeft)}</p>

                            </div>

                        </div>

                    )}

                    {order.orderStatus === "Delivered" && (

                        <div className="ProDeliverySuccessBentoCard">

                            <div className="SuccessBadgeShieldIcon">

                                <i className="bx bx-badge-check"></i>

                            </div>

                            <div className="SuccessTextCluster">

                                <h3>Order Delivered</h3>

                                <p>

                                    Delivered Successfully

                                </p>

                                <small>

                                    {order.completedAt &&
                                        new Date(order.completedAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}

                                </small>

                            </div>

                        </div>

                    )}

                    {order.orderStatus === "Cancelled" && (

                        <div className="ProDeliverySuccessBentoCard">

                            <div className="SuccessBadgeShieldIcon">

                                <i className="bx bx-x-circle"></i>

                            </div>

                            <div className="SuccessTextCluster">

                                <h3>Order Cancelled</h3>

                                <p>

                                    {order.cancelReason}

                                </p>

                            </div>

                        </div>

                    )}

                </div>

                {order.orderStatus === "On Process" && (

                    <button
                        className="CancelOrderButton"
                        onClick={cancelOrder}
                    >

                        Cancel Order

                    </button>

                )}

            </section>

        </div>

    );

};

export default TrackOrder;