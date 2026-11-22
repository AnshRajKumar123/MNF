import React from "react";
import "../../styles/StatCard.css";

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="StatCard">
            <div className="StatTop">
                <span>{title}</span>
                <div className="StatIconShield">
                    <i className={icon}></i>
                </div>
            </div>
            <h2>{value}</h2>
            <div className="StatCardGlowLine"></div>
        </div>
    );
};

export default StatCard;