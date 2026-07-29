import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

const GuestRoute = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const check = async () => {
            console.log("1. Starting profile request");

            try {
                const res = await api.get("/auth/profile");

                console.log("2. Success");
                console.log(res.data);

                setLoggedIn(true);
            } catch (err) {
                console.log("3. Error");
                console.log(err);

                if (err.response) {
                    console.log(err.response.status);
                    console.log(err.response.data);
                }

                setLoggedIn(false);
            } finally {
                console.log("4. Finally");

                setLoading(false);
            }
        };

        check();
    }, []);

    if (loading) {
        return (
            <h1 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
                Loading...
            </h1>
        );
    }

    return loggedIn
        ? <Navigate to="/mainWebsite" replace />
        : children;

};

export default GuestRoute;