import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginAdmin, getAdminProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const { setAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await loginAdmin(loginData);
            const data = await getAdminProfile();
            setAdmin(data.admin);
            toast.success("Welcome Admin");
            navigate("/dashboard");
        }
        catch (error) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <div className="LoginPage">
            <Card>
                <div className="LoginHeader">
                    <h1>MidNight Food</h1>
                    <p>Admin Dashboard</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        icon="bx bx-envelope"
                        placeholder="Email"
                        name="email"
                        value={loginData.email}
                        onChange={handleChange}
                    />

                    <Input
                        icon="bx bx-lock-alt"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;