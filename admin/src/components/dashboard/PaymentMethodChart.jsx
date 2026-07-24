import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Cell,
    Legend,
} from "recharts";

const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f97316",
    "#ef4444",
    "#06b6d4",
    "#eab308",
    "#8b5cf6",
];

const PaymentMethodChart = ({ data }) => {

    return (

        <div className="DashboardBentoCard">

            <div className="BentoCardHeader">

                <h3>

                    <i className="bx bx-credit-card"></i>

                    Payment Methods

                </h3>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="total"
                        nameKey="_id"
                        outerRadius={110}
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

};

export default PaymentMethodChart;