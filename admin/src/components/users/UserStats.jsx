const UserStats = ({
    totalOrders,
    totalSpent,
    user,
}) => {

    const joinedDate = new Date(user.createdAt).toLocaleDateString();

    const updatedDate = new Date(user.updatedAt).toLocaleDateString();

    return (

        <div className="UserStatsGrid">

            <div className="StatCard">

                <div className="StatIcon OrdersIcon">
                    <i className="bx bx-package"></i>
                </div>

                <div className="StatContent">
                    <span>Total Orders</span>
                    <h2>{totalOrders}</h2>
                </div>

            </div>

            <div className="StatCard">

                <div className="StatIcon RevenueIcon">
                    <i className="bx bx-rupee"></i>
                </div>

                <div className="StatContent">
                    <span>Total Spending</span>
                    <h2>₹{totalSpent.toFixed(2)}</h2>
                </div>

            </div>

            <div className="StatCard">

                <div className="StatIcon JoinIcon">
                    <i className="bx bx-calendar"></i>
                </div>

                <div className="StatContent">
                    <span>Joined</span>
                    <h2>{joinedDate}</h2>
                </div>

            </div>

            <div className="StatCard">

                <div className="StatIcon UpdateIcon">
                    <i className="bx bx-history"></i>
                </div>

                <div className="StatContent">
                    <span>Last Updated</span>
                    <h2>{updatedDate}</h2>
                </div>

            </div>

        </div>

    );

};

export default UserStats;