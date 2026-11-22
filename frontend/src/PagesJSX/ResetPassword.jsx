import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { validateResetToken, resetPassword } from "../services/authService";
import "../PagesCSS/ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

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
                    error.response?.data?.message || "Invalid or expired reset link."
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
            toast.success(data.message || "Password reset successful!");

            setTimeout(() => {
                navigate("/SignInUp");
            }, 1500);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="ResetPasswordPage">
                <div className="ResetStateCard">
                    <i className="bx bx-radar bx-spin StateSpinner"></i>
                    <h2>Validating Reset Link...</h2>
                    <p>Connecting to secure authentication node</p>
                </div>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className="ResetPasswordPage">
                <div className="ResetPasswordCard ExpiredCard">
                    <div className="ExpiredIconShield">
                        <i className="bx bx-error-circle"></i>
                    </div>

                    <h2>Reset Link Expired</h2>

                    <p>
                        This password reset token is invalid or has exceeded its expiration time limit.
                    </p>

                    <Link to="/forgot-password" className="ResetActionButton">
                        <i className="bx bx-refresh"></i> Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="ResetPasswordPage">
            {/* Ambient Lighting Orbs */}
            <div className="AuthGlowOrb OrbTopLeft"></div>
            <div className="AuthGlowOrb OrbBottomRight"></div>

            <div className="ResetPasswordCard">
                <div className="ResetHeader">
                    <div className="ResetIconShield">
                        <i className="bx bx-shield-quarter"></i>
                    </div>

                    <h1>Create New Password</h1>
                    <p>Set a strong security passkey to regain access to your account.</p>
                </div>

                <form className="ResetPasswordForm" onSubmit={handleSubmit}>
                    <div className="InputGroupSlot">
                        <label className="FieldLabel">New Password</label>
                        <div className="InputWrapper">
                            <i className="bx bx-lock-alt InputIcon"></i>
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="At least 6 characters"
                                className="ResetInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="PassEyeToggle"
                                onClick={() => setShowPass(!showPass)}
                                tabIndex="-1"
                            >
                                <i className={`bx ${showPass ? "bx-show" : "bx-hide"}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="InputGroupSlot">
                        <label className="FieldLabel">Confirm New Password</label>
                        <div className="InputWrapper">
                            <i className="bx bx-lock-check InputIcon"></i>
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Re-enter new password"
                                className="ResetInput"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className="ResetButton" disabled={loading}>
                        {loading ? (
                            <>
                                <i className="bx bx-loader-alt bx-spin"></i> Updating Passkey...
                            </>
                        ) : (
                            <>
                                <span>Reset Password</span>
                                <i className="bx bx-check-shield"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;