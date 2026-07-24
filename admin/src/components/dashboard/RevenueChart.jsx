import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const RevenueChart = ({ data }) => {
    return (
        <div className="DashboardBentoCard RevenueChartCard">
            <div className="BentoCardHeader">
                <h3>
                    <i className="bx bx-line-chart"></i>
                    Revenue Trend (Last 7 Days)
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />

                    <XAxis
                        dataKey="_id"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                    />

                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(val) => `₹${val}`}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111726",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#f8fafc",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                        }}
                        formatter={(val) => [`₹${val}`, "Revenue"]}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;