import "../../styles/Input.css";

const Input = ({
    icon,
    type = "text",
    placeholder,
    name,
    value,
    onChange,
}) => {
    return (
        <div className="AdminInputWrapper">
            <i className={icon}></i>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;