import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp, resetPasswordWithOtp } from "../services/authService";
import "../PagesCSS/ForgotPassword.css";

const ForgotPassword = () => {
    // 1 = Enter Email & Get OTP | 2 = Enter OTP & Set New Password
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();

    // 60-second countdown for resending OTP
    useEffect(() => {
        let timer = null;
        if (resendTimer > 0) {
            timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    // Send 6-digit OTP to user's email
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            return toast.error("Please enter a valid registered email address.");
        }

        try {
            setLoading(true);
            const res = await sendOtp(cleanEmail, "forgot_password");
            toast.success(res.message || "6-digit OTP sent to your email!");
            setStep(2);
            setResendTimer(60);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to send verification code."
            );
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and save new password in MongoDB
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp.trim() || otp.trim().length !== 6) {
            return toast.error("Please enter the 6-digit verification code.");
        }

        if (newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters.");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match. Re-enter password.");
        }

        try {
            setLoading(true);
            const res = await resetPasswordWithOtp(
                email.trim().toLowerCase(),
                otp.trim(),
                newPassword
            );
            toast.success(res.message || "Password updated successfully!");

            setTimeout(() => {
                navigate("/SignInUp");
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
            {/* Ambient Lighting Orbs */}
            <div className="AuthGlowOrb OrbTopLeft"></div>
            <div className="AuthGlowOrb OrbBottomRight"></div>

            <div className="ForgotPasswordCard">
                <div className="ForgotPasswordHeader">
                    <div className="ForgotIconShield">
                        <i className={step === 1 ? "bx bx-envelope" : "bx bx-shield-check"}></i>
                    </div>

                    <h1>{step === 1 ? "Reset Account Password" : "OTP Code Verification"}</h1>
                    <p>
                        {step === 1
                            ? "Enter your registered email address to receive a 6-digit OTP verification code."
                            : `We have sent a 6-digit OTP to ${email}. Enter the code below to update your password.`}
                    </p>
                </div>

                {/* STEP 1: ENTER EMAIL & REQUEST OTP */}
                {step === 1 ? (
                    <form className="ForgotPasswordForm" onSubmit={handleSendOtp}>
                        <div className="InputGroupSlot">
                            <label className="FieldLabel">Registered Email Address</label>
                            <div className="InputWrapper">
                                <i className="bx bx-envelope InputIcon"></i>
                                <input
                                    type="email"
                                    className="ForgotInput"
                                    placeholder="e.g. name@midnightfood.com"
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
                                    <i className="bx bx-loader-alt bx-spin"></i> Dispatching OTP...
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
                    /* STEP 2: VERIFY OTP, SET NEW PASSWORD & CONFIRM PASSWORD */
                    <form className="ForgotPasswordForm" onSubmit={handleResetPassword}>
                        <div className="InputGroupSlot">
                            <label className="FieldLabel">6-Digit Email OTP</label>
                            <div className="InputWrapper">
                                <i className="bx bx-key InputIcon"></i>
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
                            <label className="FieldLabel">New Password</label>
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
                            <label className="FieldLabel">Re-enter New Password</label>
                            <div className="InputWrapper">
                                <i className="bx bx-lock-check InputIcon"></i>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="ForgotInput"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="ForgotButton" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i> Updating Password...
                                </>
                            ) : (
                                <>
                                    <span>Save Password & Sign In</span>
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
                                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend OTP Code"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="ForgotFooter">
                    <Link to="/SignInUp" className="BackLink">
                        <i className="bx bx-arrow-back"></i>
                        <span>Back to Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;