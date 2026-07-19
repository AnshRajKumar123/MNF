import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                await axios.get(
                    "http://localhost:3000/auth/profile",
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