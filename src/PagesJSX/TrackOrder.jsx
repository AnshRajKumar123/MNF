import React, { useEffect, useState } from "react";
import "../PagesCSS/TrackOrder.css";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "Order Confirmed",
        "Restaurant is Preparing",
        "Delivery Partner Assigned",
        "Out for Delivery",
        "Delivered"
    ];

    const rider = {
        name: "Rohit Kumar",
        vehicle: "UP14 AQ 9921",
        image:
            "https://cdn-icons-png.flaticon.com/512/3917/3917036.png"
    };

    // Load Order ID
    useEffect(() => {
        const id = localStorage.getItem("MNF_OrderID");
        if (id) setOrderId(id);
    }, []);

    // Auto-progress order status
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                return prev;
            });
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="track-container">

            <h2 className="track-title">Track Your Order</h2>

            <p className="track-order-id">Order ID: {orderId}</p>

            {/* Status Steps */}
            <div className="steps-container">
                {steps.map((step, index) => (
                    <div className="step" key={index}>
                        <div
                            className={`step-circle ${index <= currentStep ? "active" : ""}`}
                        >
                            {index < currentStep ? "✔" : index + 1}
                        </div>
                        <p
                            className={`step-label ${index <= currentStep ? "active" : ""}`}
                        >
                            {step}
                        </p>
                        {index < steps.length - 1 && (
                            <div
                                className={`step-line ${index < currentStep ? "active" : ""}`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Rider Info */}
            {currentStep >= 2 && currentStep < 4 && (
                <div className="rider-box">
                    <img src={rider.image} className="rider-img" alt="Rider" />
                    <div>
                        <h3 className="rider-name">{rider.name}</h3>
                        <p className="rider-vehicle">{rider.vehicle}</p>
                    </div>
                </div>
            )}

            {/* Out For Delivery ETA */}
            {currentStep === 3 && (
                <p className="eta-text">Your order is arriving in approx 18–25 minutes</p>
            )}

            {/* Delivered */}
            {currentStep === 4 && (
                <div className="delivered-box">
                    🎉 Your order has been delivered. Enjoy your meal!
                </div>
            )}

        </div>
    );
};

export default TrackOrder;
