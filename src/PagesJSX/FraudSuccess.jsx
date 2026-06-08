import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/FraudSuccess.css";

const FraudSuccess = () => {
    return (
        <div className="success-container">
            <div className="success-box">
                <div className="success-icon-wrap">
                    <div className="success-check"></div>
                </div>

                <h1>Report Submitted</h1>
                <p>
                    Thank you for helping keep MNF safe.
                    Our internal security team will review your report shortly.
                </p>

                <div className="AlignCenter">
                    <Link to="/mainWebsite" className="success-btn">Go to Home</Link>
                    <Link to="/help-support" className="success-btn outline">Help & Support</Link>
                </div>
            </div>
        </div>
    );
};

export default FraudSuccess;
