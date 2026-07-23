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
    const [showPassword, setShowPassword] = useState(false);

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

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill in all credentials");
            return;
        }

        try {
            setLoading(true);
            await loginAdmin(loginData);
            const data = await getAdminProfile();
            setAdmin(data.admin);
            toast.success("Authentication successful! Welcome Back.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid Admin Credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="LoginPage">
            {/* Ambient Background Glow Accents */}
            <div className="LoginGlowSphere GlowTopLeft"></div>
            <div className="LoginGlowSphere GlowBottomRight"></div>

            <Card className="AdminLoginCard">
                {/* BRAND & SECURITY HEADER */}
                <div className="LoginHeader">
                    <div className="LoginLogoBadge">
                        <i className="bx bx-shield-quarter"></i>
                    </div>

                    <span className="SecurityNodePill">
                        <span className="PulseDot"></span> SECURE CONTROL NODE
                    </span>

                    <h1>MidNight Food</h1>
                    <p>Enter administrative credentials to access console</p>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit} className="LoginForm">
                    <div className="InputGroupSlot">
                        <label className="FieldLabel">Admin Email Node</label>
                        <Input
                            icon="bx bx-envelope"
                            placeholder="admin@midnightfood.com"
                            name="email"
                            type="email"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="InputGroupSlot">
                        <label className="FieldLabel">Security Keypass</label>
                        <div className="PasswordInputWrapper">
                            <Input
                                icon="bx bx-lock-alt"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="TogglePasswordBtn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}></i>
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="AdminLoginSubmitBtn"
                    >
                        {loading ? "Authenticating..." : "Access Control Terminal"}
                    </Button>
                </form>

                {/* FOOTER METADATA */}
                <div className="LoginCardFooter">
                    <span><i className="bx bx-lock-check"></i> Encrypted RSA-4096 Protocol</span>
                    <span>v2.4 Console</span>
                </div>
            </Card>
        </div>
    );
};

export default Login;