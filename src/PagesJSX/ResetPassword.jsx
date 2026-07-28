import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { validateResetToken, resetPassword, } from "../services/authService";
import "../PagesCSS/ResetPassword.css";

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {

        const checkToken = async () => {

            try {

                await validateResetToken(token);

                setValidToken(true);

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Invalid or expired reset link."
                );

                setValidToken(false);

            } finally {

                setChecking(false);

            }

        };

        checkToken();

    }, [token]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {

            setLoading(true);

            const data = await resetPassword(token, password);

            toast.success(data.message);

            setTimeout(() => {
                navigate("/SignInUp");
            }, 1500);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }

    };

    if (checking) {

        return (
            <div className="ResetPasswordPage">
                <h2>Checking reset link...</h2>
            </div>
        );

    }

    if (!validToken) {

        return (

            <div className="ResetPasswordPage">

                <div className="ResetPasswordCard">

                    <h2>Reset Link Expired</h2>

                    <p>
                        This password reset link is invalid or has expired.
                    </p>

                    <Link to="/forgot-password">
                        Request a new reset link
                    </Link>

                </div>

            </div>

        );

    }

    return (

        <div className="ResetPasswordPage">

            <div className="ResetPasswordCard">

                <h1>Create New Password</h1>

                <form
                    className="ResetPasswordForm"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="password"
                        placeholder="New Password"
                        className="ResetInput"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="ResetInput"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        className="ResetButton"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>

        </div>

    );

};

export default ResetPassword;