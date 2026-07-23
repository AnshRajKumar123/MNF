import "../../styles/StatCard.css";

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="StatCard">

            <div className="StatTop">

                <span>{title}</span>

                <i className={icon}></i>

            </div>

            <h2>{value}</h2>

        </div>
    );
};

export default StatCard;