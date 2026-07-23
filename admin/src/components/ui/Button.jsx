import "../../styles/Button.css";

const Button = ({
    children,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
}) => {

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className="AdminButton"
        >
            {loading ? "Please wait..." : children}
        </button>
    );

};

export default Button;