import "../../styles/Card.css";

const Card = ({ children }) => {
    return (
        <div className="AdminCard">
            {children}
        </div>
    );
};

export default Card;