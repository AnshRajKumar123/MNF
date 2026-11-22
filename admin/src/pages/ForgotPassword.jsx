import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendAdminForgotOtp, resetAdminPasswordWithOtp } from "../services/authService";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Request OTP | 2 = Verify OTP & Update Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();

    // 60-second cooldown timer
    useEffect(() => {
        let timer = null;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            return toast.error("Please enter a valid administrator email address.");
        }

        try {
            setLoading(true);
            const res = await sendAdminForgotOtp(cleanEmail);
            toast.success(res.message || "6-digit OTP code sent to your email!");
            setStep(2);
            setResendTimer(60);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to dispatch admin verification code."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp.trim() || otp.trim().length !== 6) {
            return toast.error("Please enter the 6-digit verification code.");
        }

        if (newPassword.length < 6) {
            return toast.error("New admin password must be at least 6 characters.");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match. Re-enter password.");
        }

        try {
            setLoading(true);
            const res = await resetAdminPasswordWithOtp(
                email.trim().toLowerCase(),
                otp.trim(),
                newPassword
            );
            toast.success(res.message || "Admin credentials updated successfully!");

            setTimeout(() => {
                navigate("/"); // Back to Admin Login
            }, 1200);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid OTP code or password reset failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ForgotPasswordPage">
            <div className="AuthGlowOrb OrbTopLeft"></div>
            <div className="AuthGlowOrb OrbBottomRight"></div>

            <div className="ForgotPasswordCard">
                <div className="ForgotPasswordHeader">
                    <div className="ForgotIconShield">
                        <i className={step === 1 ? "bx bx-shield-quarter" : "bx bx-key"}></i>
                    </div>

                    <h1>{step === 1 ? "Admin Keypass Recovery" : "Security Verification"}</h1>
                    <p>
                        {step === 1
                            ? "Enter your official administrator email to receive a 6-digit OTP security key."
                            : `We have sent a 6-digit OTP to ${email}. Enter the code below to configure a new password.`}
                    </p>
                </div>

                {step === 1 ? (
                    <form className="ForgotPasswordForm" onSubmit={handleSendOtp}>
                        <div className="InputGroupSlot">
                            <label className="FieldLabel">Admin Email Node</label>
                            <div className="InputWrapper">
                                <i className="bx bx-envelope InputIcon"></i>
                                <input
                                    type="email"
                                    className="ForgotInput"
                                    placeholder="admin@midnightfood.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button type="submit" className="ForgotButton" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i> Dispatching Keypass OTP...
                                </>
                            ) : (
                                <>
                                    <span>Send Verification OTP</span>
                                    <i className="bx bx-right-arrow-alt"></i>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form className="ForgotPasswordForm" onSubmit={handleResetPassword}>
                        <div className="InputGroupSlot">
                            <label className="FieldLabel">6-Digit Security OTP</label>
                            <div className="InputWrapper">
                                <i className="bx bx-shield InputIcon"></i>
                                <input
                                    type="text"
                                    maxLength="6"
                                    className="ForgotInput OtpCodeInput"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="InputGroupSlot">
                            <label className="FieldLabel">New Admin Password</label>
                            <div className="InputWrapper">
                                <i className="bx bx-lock-alt InputIcon"></i>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="ForgotInput"
                                    placeholder="Create new password (min 6 chars)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="PassEyeToggleBtn"
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
                                    className="ForgotInput"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="ForgotButton" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i> Updating Passkey...
                                </>
                            ) : (
                                <>
                                    <span>Save Keypass & Access Console</span>
                                    <i className="bx bx-check-shield"></i>
                                </>
                            )}
                        </button>

                        <div className="OtpResendDeck">
                            <button
                                type="button"
                                className="ResendOtpLink"
                                disabled={resendTimer > 0 || loading}
                                onClick={handleSendOtp}
                            >
                                {resendTimer > 0 ? `Resend Keypass in ${resendTimer}s` : "Resend Security Code"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="ForgotFooter">
                    <Link to="/" className="BackLink">
                        <i className="bx bx-arrow-back"></i>
                        <span>Back to Console Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;