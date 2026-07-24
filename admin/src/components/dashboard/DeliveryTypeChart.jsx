import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = ["#06b6d4", "#10b981", "#f59e0b"];

const DeliveryTypeChart = ({ data }) => {
    return (
        <div className="DashboardBentoCard">
            <div className="BentoCardHeader">
                <h3>
                    <i className="bx bxs-truck"></i>
                    Delivery Dispatch Types
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                                stroke="transparent"
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111726",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#f8fafc",
                        }}
                    />

                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DeliveryTypeChart;