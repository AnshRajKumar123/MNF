import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

const GuestRoute = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {

        const check = async () => {

            try {
                await api.get("/auth/profile");
                setLoggedIn(true);
            } catch {
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }

        };

        check();

    }, []);

    if (loading) return null;

    return loggedIn
        ? <Navigate to="/mainWebsite" replace />
        : children;

};

export default GuestRoute;