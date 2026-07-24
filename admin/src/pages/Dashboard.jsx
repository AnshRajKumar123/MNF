import React, { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import { getDashboardAnalytics } from "../services/analyticsService";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopProducts from "../components/dashboard/TopProducts";
import PaymentMethodChart from "../components/dashboard/PaymentMethodChart";
import DeliveryTypeChart from "../components/dashboard/DeliveryTypeChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const data = await getDashboardAnalytics();

                setAnalytics(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchAnalytics();

    }, []);

    if (loading) {
        return (
            <div className="AdminDashboardLoading">
                <div className="LoadingPulseSpinner">
                    <i className="bx bx-radar bx-spin"></i>
                </div>
                <h2>Synchronizing Control Telemetry...</h2>
                <p>Connecting to backend dispatch server</p>
            </div>
        );
    }

    return (
        <div className="Dashboard">

            {/* HERO BANNER SECTION */}
            <div className="DashboardHeroBanner">
                <div className="BannerTextCluster">
                    <span className="LiveStatusBadge">
                        <span className="PulseDot"></span> REAL-TIME MONITORING
                    </span>
                    <h1>Operational Control Center</h1>
                    <p>Overview of food dispatch metrics, platform revenue, and active system nodes.</p>
                </div>

                <div className="QuickActionDeck">
                    <button
                        className="ActionPillBtn PrimaryBtn"
                        onClick={() => window.location.href = "/orders"}
                    >
                        <i className="bx bx-receipt"></i> Process Orders
                    </button>
                    <button
                        className="ActionPillBtn SecondaryBtn"
                        onClick={() => window.location.href = "/products"}
                    >
                        <i className="bx bx-plus-circle"></i> Add Dish
                    </button>
                </div>
            </div>

            {/* METRICS STATS GRID */}
            <div className="StatsGrid">
                <StatCard
                    title="Revenue"
                    value={`₹${(analytics?.revenue.total || 0).toLocaleString("en-IN")}`}
                    icon="bx bx-wallet"
                />

                <StatCard
                    title="Orders"
                    value={analytics?.orders.total || 0}
                    icon="bx bx-cart"
                />

                <StatCard
                    title="Users"
                    value={analytics?.users.total || 0}
                    icon="bx bx-user"
                />

                <StatCard
                    title="Products"
                    value={analytics?.products.total || 0}
                    icon="bx bx-package"
                />
            </div>

            {/* SECONDARY SYSTEM SUMMARY BENTO GRID */}
            <div className="DashboardBentoSection">
                {/* DISPATCH SUMMARY */}
                <div className="DashboardBentoCard SystemOverviewCard">
                    <div className="BentoCardHeader">
                        <h3><i className="bx bx-pulse"></i> Dispatch Pipeline</h3>
                        <span className="TelemetryTag">Live Data</span>
                    </div>

                    <div className="PipelineMetricRow">

                        <div className="PipelineUnit">
                            <span className="MetricLabel">Today's Revenue</span>
                            <strong className="MetricVal success-text">
                                ₹{(analytics?.revenue?.today || 0).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="PipelineDivider"></div>

                        <div className="PipelineUnit">
                            <span className="MetricLabel">Today's Orders</span>
                            <strong className="MetricVal info-text">
                                {analytics?.orders?.today || 0}
                            </strong>
                        </div>

                        <div className="PipelineDivider"></div>

                        <div className="PipelineUnit">
                            <span className="MetricLabel">Active Coupons</span>
                            <strong className="MetricVal warning-text">
                                {analytics?.coupons?.active || 0}
                            </strong>
                        </div>

                    </div>
                </div>

                <div className="DashboardCharts">

                    <RevenueChart
                        data={analytics?.revenueChart || []}
                    />

                    <PaymentMethodChart
                        data={analytics?.paymentMethods || []}
                    />

                </div>

                <div className="DashboardCharts">

                    <DeliveryTypeChart
                        data={analytics?.deliveryTypes || []}
                    />

                    <TopProducts
                        products={analytics?.topProducts || []}
                    />

                </div>

                {/* SYSTEM HEALTH WIDGET */}
                <div className="DashboardBentoCard SystemHealthCard">
                    <div className="BentoCardHeader">
                        <h3><i className="bx bx-server"></i> System Health</h3>
                    </div>

                    <div className="HealthMetricList">
                        <div className="HealthItem">
                            <span>Payment Gateway</span>
                            <span className="StatusTag Operational">Connected</span>
                        </div>
                        <div className="HealthItem">
                            <span>Database Cluster</span>
                            <span className="StatusTag Operational">Active</span>
                        </div>
                        <div className="HealthItem">
                            <span>Notification Hub</span>
                            <span className="StatusTag Operational">Online</span>
                        </div>
                    </div>
                </div>
                <RecentOrders
                    orders={analytics?.recentOrders || []}
                />
            </div>

        </div>
    );
};

export default Dashboard;