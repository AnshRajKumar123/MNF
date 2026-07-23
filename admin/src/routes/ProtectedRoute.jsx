import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const {
        admin,
        setAdmin,
    } = useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const data = await getAdminProfile();
                setAdmin(data.admin);
            }
            catch {
                setAdmin(null);
            }
            finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, []);

    if (loading)
        return <h2>Loading...</h2>;

    return admin
        ? <Outlet />
        : <Navigate to="/" replace />;

};

export default ProtectedRoute;