import React from "react";

const UserStats = ({ totalOrders, totalSpent, user }) => {
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "N/A";

    const updatedDate = user?.updatedAt
        ? new Date(user.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "N/A";

    return (
        <div className="UserStatsGrid">
            <div className="StatCard">
                <div className="StatIcon OrdersIcon">
                    <i className="bx bx-package"></i>
                </div>
                <div className="StatContent">
                    <span>Total Orders</span>
                    <h2>{totalOrders || 0}</h2>
                </div>
            </div>

            <div className="StatCard">
                <div className="StatIcon RevenueIcon">
                    <i className="bx bx-wallet"></i>
                </div>
                <div className="StatContent">
                    <span>Total Expenditure</span>
                    <h2>₹{(totalSpent || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>

            <div className="StatCard">
                <div className="StatIcon JoinIcon">
                    <i className="bx bx-calendar"></i>
                </div>
                <div className="StatContent">
                    <span>Registration Date</span>
                    <h2>{joinedDate}</h2>
                </div>
            </div>

            <div className="StatCard">
                <div className="StatIcon UpdateIcon">
                    <i className="bx bx-history"></i>
                </div>
                <div className="StatContent">
                    <span>Last Profile Activity</span>
                    <h2>{updatedDate}</h2>
                </div>
            </div>
        </div>
    );
};

export default UserStats;