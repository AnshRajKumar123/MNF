import React, { useEffect } from "react";
import "../ComponentCSS/Toast.css";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000); // hide after 2 sec
        return () => clearTimeout(timer);
    }, []);

    return <div className="ToastBox">{message}</div>;
};

export default Toast;