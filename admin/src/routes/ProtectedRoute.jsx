import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { admin, setAdmin } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAdmin = async () => {
            try {
                const data = await getAdminProfile();
                if (isMounted) {
                    setAdmin(data.admin);
                }
            } catch (error) {
                if (isMounted) {
                    localStorage.removeItem("mnfAdminLoggedIn");
                    setAdmin(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAdmin();

        return () => {
            isMounted = false;
        };
    }, [setAdmin]);

    if (loading) {
        return (
            <div style={{
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#090d16",
                color: "#6366f1",
                fontFamily: "sans-serif"
            }}>
                <i className="bx bx-radar bx-spin" style={{ fontSize: "40px", marginBottom: "12px" }}></i>
                <span style={{ fontSize: "14px", color: "#94a3b8" }}>Verifying Administrator Credentials...</span>
            </div>
        );
    }

    return admin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;