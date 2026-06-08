import React, { useEffect, useState } from "react";
import "../PagesCSS/Payment.css"; // Popup styles already included
import { useNavigate } from "react-router-dom";

const OrderSuccessPopup = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");

    // Generate Order ID → MNF-XXXXXX
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
        <div className="order-success-overlay">
            <div className="order-success-box">

                <div className="success-icon">✔</div>

                <h2 className="order-success-title">Order Successful</h2>

                <p className="order-id-text">
                    Order ID: <b>{orderId}</b>
                </p>

                <button className="track-btn" onClick={goToTrackOrder}>
                    Track Order
                </button>

            </div>
        </div>
    );
};

export default OrderSuccessPopup;