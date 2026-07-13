import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/HelpSuccess.css";
import { midnightHelpSuccessData } from "../assets/assest";

const HelpSuccess = () => {
    return (
        <div className="ProHelpSuccessContainer">
            <div className="ProHelpSuccessBentoCard">

                {/* Clean morphic neon-illuminated vector indicator badge */}
                <div className="ProHelpSuccessIconShield">
                    <div className="ProHelpSuccessPulseRing"></div>
                    <i className='bx bx-check-shield'></i>
                </div>

                <span className="ProSystemLedgerText">{midnightHelpSuccessData.labels.title}</span>
                <h1>{midnightHelpSuccessData.labels.subtitle}</h1>
                <p>{midnightHelpSuccessData.labels.description}</p>

                <div className="ProHelpSuccessActionGroup">
                    <Link to="/mainWebsite" className="ProHelpSuccessBtn">
                        {midnightHelpSuccessData.labels.homeBtn} <i className='bx bx-home-alt'></i>
                    </Link>
                    <Link to="/help-support" className="ProHelpSuccessBtn ButtonOutlineVariant">
                        {midnightHelpSuccessData.labels.backBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HelpSuccess;