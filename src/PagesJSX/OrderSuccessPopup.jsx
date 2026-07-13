import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PagesCSS/Payment.css"; // Styles targeted below
import { midnightOrderSuccessData } from "../assets/assest";

const OrderSuccessPopup = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");

    const generateOrderId = () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `MNF-${randomNum}`;
    };

    useEffect(() => {
        let savedOrder = localStorage.getItem("MNF_OrderID");

        if (!savedOrder) {
            const newOrder = generateOrderId();
            localStorage.setItem("MNF_OrderID", newOrder);
            savedOrder = newOrder;
        }

        setOrderId(savedOrder);
    }, []);

    const goToTrackOrder = () => {
        navigate("/track-order");
    };

    return (
        <div className="ProOrderSuccessOverlay">
            <div className="ProOrderSuccessBentoCard">
                
                {/* Neon-illuminated floating vector status badge shield */}
                <div className="ProOrderSuccessIconShield">
                    <div className="ProOrderPulseRing"></div>
                    <i className='bx bx-party'></i>
                </div>

                <span className="ProSystemLedgerTagText">{midnightOrderSuccessData.labels.title}</span>
                <h2 className="ProOrderSuccessTitleText">{midnightOrderSuccessData.labels.subtitle}</h2>

                {/* Morphic data bento slot row container for systemic credentials */}
                <div className="ProOrderIdTelemetryBox">
                    <span>{midnightOrderSuccessData.labels.idPrefix}</span>
                    <strong>{orderId}</strong>
                </div>

                <button className="ProOrderTrackCTA" onClick={goToTrackOrder}>
                    {midnightOrderSuccessData.labels.trackBtn} <i className='bx bx-navigation'></i>
                </button>

            </div>
        </div>
    );
};

export default OrderSuccessPopup;