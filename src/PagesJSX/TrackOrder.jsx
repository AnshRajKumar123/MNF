import React, { useEffect, useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/TrackOrder.css";
import { midnightTrackingData } from "../assets/assest";
import { useParams } from "react-router-dom";


const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [order, setOrder] = useState(null);

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                const { data } = await api.get(`/order/${orderId}`);

                setOrder(data.order);

            } catch (err) {

                console.log(err);

            }

        };

        fetchOrder();

    }, [orderId]);

    const steps = midnightTrackingData.steps;

    const rider = {
        name: "Rohit Kumar",
        vehicle: "UP14 AQ 9921",
        image: "https://cdn-icons-png.flaticon.com/512/3917/3917036.png"
    };

    useEffect(() => {
        const id = localStorage.getItem("MNF_OrderID");
        if (id) setOrderId(id);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                return prev;
            });
        }, 3000);

        return () => clearInterval(timer);
    }, [steps.length]);

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
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
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
                                <img src={rider.image} alt="Rider Operational Avatar" />
                            </div>
                            <div className="RiderProfileMetadata">
                                <h3>{rider.name}</h3>
                                <span>{rider.vehicle}</span>
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
                                <p>{midnightTrackingData.labels.etaTime}</p>
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