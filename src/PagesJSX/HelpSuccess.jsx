import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/HelpSuccess.css";

const HelpSuccess = () => {
    return (
        <div className="help-success-container">
            <div className="help-success-box">
                <div className="help-success-icon-wrap">
                    <div className="help-success-check"></div>
                </div>

                <h1>We Received Your Request</h1>
                <p>
                    Our support team will contact you shortly via email.
                    Thanks for taking the time to reach out!
                </p>

                <div className="AlignCenter">
                    <Link to="/mainWebsite" className="help-success-btn">Go to Home</Link>
                    <Link to="/help-support" className="help-success-btn outline">Back to Help</Link>
                </div>
            </div>
        </div>
    );
};

export default HelpSuccess;
