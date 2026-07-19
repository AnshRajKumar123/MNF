import React from "react";
import { Link } from "react-router-dom";
import "../PagesCSS/NotFound.css"; // Styles targeted below
import { midnightErrorData } from "../assets/assest";

const NotFound = () => {
    return (
        <div className="ProErrorSuiteContainer">
            <div className="ProErrorBentoCard">

                {/* Neon-illuminated floating radar pulse exception badge */}
                <div className="ProErrorIconShield">
                    <div className="ProErrorPulseRing"></div>
                    <i className='bx bx-radar'></i>
                </div>

                <span className="ProSystemErrorCodeTag">{midnightErrorData.labels.errorCode}</span>
                <h1 className="ProErrorTitleText">{midnightErrorData.labels.title}</h1>
                <h2 className="ProErrorSubtitleText">{midnightErrorData.labels.subtitle}</h2>
                <p className="ProErrorDescText">{midnightErrorData.labels.description}</p>

                <div className="ProErrorActionGroup">
                    <Link to="/mainWebsite" className="ProErrorRedirectCTA">
                        {midnightErrorData.labels.actionBtn} <i className='bx bx-terminal'></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;