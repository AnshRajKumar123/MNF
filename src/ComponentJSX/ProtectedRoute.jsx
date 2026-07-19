import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {

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

            } catch (error) {

                setAuthenticated(false);

            } finally {

                setLoading(false);

            }

        };

        checkAuth();

    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/SignInUp" replace />;
    }

    return children;

};

export default ProtectedRoute;