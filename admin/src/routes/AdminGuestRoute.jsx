 import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

const AdminGuestRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {

        const checkAdmin = async () => {
            try {
                await api.get("/admin/profile");
                setLoggedIn(true);
            } catch {
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();

    }, []);

    if (loading) {
        return null;
    }

    return loggedIn
        ? <Navigate to="/dashboard" replace />
        : children;
};

export default AdminGuestRoute;