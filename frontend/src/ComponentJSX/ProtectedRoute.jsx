import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

const ProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                await axios.get(
                    `${API_URL}/auth/profile`,
                    {
                        withCredentials: true,
                    }
                );

                setAuthenticated(true);

            } catch {

                setAuthenticated(false);

            } finally {

                setLoading(false);

            }

        };

        checkAuth();

    }, []);

    if (loading) return <h2>Loading...</h2>;

    return authenticated ? <Outlet /> : <Navigate to="/SignInUp" replace />;
};

export default ProtectedRoute;