import {
    ResponsiveContainer,
    LineChart,
    Line,
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
                    Revenue (Last 7 Days)
                </h3>
            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="_id"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );

};

export default RevenueChart;