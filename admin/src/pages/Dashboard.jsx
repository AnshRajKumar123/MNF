import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardService";
import "../styles/Dashboard.css";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const data = await getDashboard();

                setDashboard(data);

            } catch (error) {

                console.log(error);

            }

        };

        loadDashboard();

    }, []);

    return (

        <div className="Dashboard">

            <div className="StatsGrid">

                <StatCard
                    title="Revenue"
                    value={`₹${dashboard?.totalRevenue || 0}`}
                    icon="bx bx-wallet"
                />

                <StatCard
                    title="Orders"
                    value={dashboard?.totalOrders || 0}
                    icon="bx bx-cart"
                />

                <StatCard
                    title="Users"
                    value={dashboard?.totalUsers || 0}
                    icon="bx bx-user"
                />

                <StatCard
                    title="Products"
                    value={dashboard?.totalProducts || 0}
                    icon="bx bx-package"
                />

            </div>

        </div>

    );

};

export default Dashboard;