import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
];

const DeliveryTypeChart = ({ data }) => {

    return (

        <div className="DashboardBentoCard">

            <div className="BentoCardHeader">

                <h3>

                    <i className="bx bxs-truck"></i>

                    Delivery Types

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

export default DeliveryTypeChart;