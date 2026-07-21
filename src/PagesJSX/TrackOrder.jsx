import React, { useEffect, useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/TrackOrder.css";
import { midnightTrackingData } from "../assets/assest";
import { useParams } from "react-router-dom";
import api from "../config/axios";


const TrackOrder = () => {
    const [order, setOrder] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const { orderId } = useParams();

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

            const now = new Date().getTime();

            const delivery = new Date(order.estimatedDelivery).getTime();

            const remaining = Math.max(0, delivery - now);

            setTimeLeft(remaining);

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

            setProgress(percent);

        }, 1000);

        return () => clearInterval(timer);

    }, [order]);

    const formatTime = (ms) => {

        const totalSeconds = Math.floor(ms / 1000);

        const minutes = Math.floor(totalSeconds / 60);

        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    };

    const steps = midnightTrackingData.steps;

    useEffect(() => {

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

    }, [progress]);

    return (
        <div className="ProTrackingOuterSuite">
            <AnotherNav />

            <section className="ProTrackingSectionLayout">
                <header className="ProTrackingHeaderDeckPanel">
                    <h1>{midnightTrackingData.labels.pageTitle}</h1>

                    <div className="ProTrackingTelemetryBox">
                        <span>{midnightTrackingData.labels.idPrefix}</span>
                        <strong>{orderId || "MNF-PENDING"}</strong>
                    </div>
                </header>

                {/* --- MODERN DYNAMIC HORIZONTAL STEPPER LAYER --- */}
                <div className="ProHorizontalStepperContainer">
                    <div className="HorizontalTimelineTrackLine">
                        <div
                            className="TimelineTrackProgressFill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="ProHorizontalStepsFlexRow">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isActive = index === currentStep;

                            return (
                                <div className={`ProStepNodeCell ${isActive ? "cell-active" : ""} ${isCompleted ? "cell-completed" : ""}`} key={index}>
                                    <div className="StepNodeCircleShield">
                                        {isCompleted ? <i className='bx bx-check'></i> : <span>{index + 1}</span>}
                                        {isActive && <span className="StepNodeActivePulseNode"></span>}
                                    </div>
                                    <p className="StepNodeTextLabel">{step}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- BOTTOM BENTO CONTROL DECKS --- */}
                <div className="ProTrackingBentoStatusDeck">

                    {/* LIVE RIDER TELEMETRY DATA PANEL */}
                    {currentStep >= 2 && currentStep < 4 && (
                        <div className="ProRiderConsoleBentoCard">
                            <div className="RiderAvatarFrame">
                                <img src={order?.rider?.image} alt="" />
                            </div>
                            <div className="RiderProfileMetadata">
                                <h3>{order?.rider?.name}</h3>
                                <span>{order?.rider?.vehicle}</span>
                            </div>
                            <div className="RiderStatusIndicatorTag">
                                <span className="LiveStatusPulse"></span> Active Courier
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC REALTIME ARRIVAL NOTICES */}
                    {currentStep === 3 && (
                        <div className="ProArrivalEtaNoticeCard">
                            <div className="EtaAlertIconBox"><i className='bx bx-time-five'></i></div>
                            <div className="EtaAlertTextCluster">
                                <h3>{midnightTrackingData.labels.etaNotice}</h3>
                                <p>{formatTime(timeLeft)}</p>
                            </div>
                        </div>
                    )}

                    {/* TRANSIT COMPLETE NOTIFICATION PANEL */}
                    {currentStep === 4 && (
                        <div className="ProDeliverySuccessBentoCard">
                            <div className="SuccessBadgeShieldIcon"><i className='bx bx-badge-check'></i></div>
                            <div className="SuccessTextCluster">
                                <h3>{midnightTrackingData.labels.deliveryAlert}</h3>
                                <p>{midnightTrackingData.labels.deliverySuccess}</p>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
};

export default TrackOrder;