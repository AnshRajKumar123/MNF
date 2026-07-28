import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { validateResetToken, resetPassword } from "../services/authService";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({ new: false, confirm: false });

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
                    error.response?.data?.message || "Invalid or expired reset token authorization."
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
            return toast.error("Admin passkey must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
            return toast.error("Keypass confirmation does not match.");
        }

        try {
            setLoading(true);
            const data = await resetPassword(token, password);
            toast.success(data.message || "Admin password updated successfully!");

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to update keypass credential."
            );
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="AdminResetPage">
                <div className="AdminResetLoadingState">
                    <i className="bx bx-radar bx-spin LoadingIcon"></i>
                    <h2>Validating Authorization Token...</h2>
                    <p>Connecting to security subsystem</p>
                </div>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className="AdminResetPage">
                <div className="AdminResetCard ExpiredTokenCard">
                    <div className="ExpiredShieldIcon">
                        <i className="bx bx-shield-x"></i>
                    </div>

                    <h2>Authorization Expired</h2>

                    <p>
                        This admin password reset link is invalid or has expired. Please request a new authorization token.
                    </p>

                    <Link to="/forgot-password" className="AdminResetActionBtn">
                        <i className="bx bx-refresh"></i> Request New Reset Token
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="AdminResetPage">
            {/* Ambient Backdrop Orbs */}
            <div className="AdminGlowSphere GlowTopLeft"></div>
            <div className="AdminGlowSphere GlowBottomRight"></div>

            <div className="AdminResetCard">
                <div className="AdminResetHeader">
                    <div className="AdminResetLogoBadge">
                        <i className="bx bx-key"></i>
                    </div>

                    <span className="SecurityNodePill">
                        <span className="PulseDot"></span> CREDENTIAL UPDATE TERMINAL
                    </span>

                    <h1>Reconfigure Keypass</h1>
                    <p>Enter a new secure administrator password for your account console</p>
                </div>

                <form className="AdminResetForm" onSubmit={handleSubmit}>
                    <div className="InputGroupSlot">
                        <label className="FieldLabel">New Password Keypass</label>
                        <div className="InputWrapper">
                            <i className="bx bx-lock-alt InputIcon"></i>
                            <input
                                type={showPassword.new ? "text" : "password"}
                                className="AdminResetInput"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="PasswordToggleBtn"
                                onClick={() =>
                                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                                }
                                tabIndex="-1"
                            >
                                <i className={`bx ${showPassword.new ? "bx-show" : "bx-hide"}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="InputGroupSlot">
                        <label className="FieldLabel">Confirm Keypass</label>
                        <div className="InputWrapper">
                            <i className="bx bx-lock-check InputIcon"></i>
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                className="AdminResetInput"
                                placeholder="••••••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="PasswordToggleBtn"
                                onClick={() =>
                                    setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                                }
                                tabIndex="-1"
                            >
                                <i className={`bx ${showPassword.confirm ? "bx-show" : "bx-hide"}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="AdminResetSubmitBtn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="bx bx-loader-alt bx-spin"></i> Updating Passkey...
                            </>
                        ) : (
                            <>
                                <span>Save New Password</span>
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