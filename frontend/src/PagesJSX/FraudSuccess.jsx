import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/FraudSuccess.css";
import { midnightFraudConfig } from "../assets/assest";

const FraudSuccess = () => {
    return (
        <div className="ProFraudSuccessContainer">
            <div className="ProFraudSuccessBentoCard">

                {/* Immersive security checking ring indicator badge panel */}
                <div className="ProFraudSuccessIconShield">
                    <div className="ProFraudSuccessPulseRing"></div>
                    <i className='bx bx-check-shield'></i>
                </div>

                <span className="ProSystemLedgerText">{midnightFraudConfig.success.title}</span>
                <h1>{midnightFraudConfig.success.subtitle}</h1>
                <p>{midnightFraudConfig.success.description}</p>

                <div className="ProFraudSuccessActionGroup">
                    <Link to="/mainWebsite" className="ProFraudSuccessBtn">
                        {midnightFraudConfig.success.homeBtn} <i className='bx bx-log-out-circle'></i>
                    </Link>
                    <Link to="/help-support" className="ProFraudSuccessBtn ButtonOutlineVariant">
                        {midnightFraudConfig.success.supportBtn}
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default FraudSuccess;