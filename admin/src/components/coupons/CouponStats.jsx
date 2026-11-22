import React from "react";

const CouponStats = ({ stats }) => {
    const cards = [
        {
            title: "Total Coupons",
            value: stats?.total || 0,
            icon: "bx bxs-coupon",
            className: "TotalCouponCard",
        },
        {
            title: "Active Campaigns",
            value: stats?.active || 0,
            icon: "bx bx-check-shield",
            className: "ActiveCouponCard",
        },
        {
            title: "Expired",
            value: stats?.expired || 0,
            icon: "bx bx-time-five",
            className: "ExpiredCouponCard",
        },
        {
            title: "Disabled Nodes",
            value: stats?.disabled || 0,
            icon: "bx bx-block",
            className: "DisabledCouponCard",
        },
    ];

    return (
        <div className="CouponStatsGrid">
            {cards.map((card) => (
                <div key={card.title} className={`CouponStatCard ${card.className}`}>
                    <div className="CouponStatIcon">
                        <i className={card.icon}></i>
                    </div>

                    <div className="CouponStatContent">
                        <span>{card.title}</span>
                        <h2>{card.value}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CouponStats;