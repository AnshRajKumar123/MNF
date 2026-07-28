import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService";
import "../PagesCSS/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);
            const data = await forgotPassword(email);
            toast.success(data.message || "Reset link sent to your email!");
            setEmailSent(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to send reset email."
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
                        <i className={emailSent ? "bx bx-mail-send" : "bx bx-lock-open-alt"}></i>
                    </div>

                    <h1>{emailSent ? "Check Your Email" : "Forgot Password?"}</h1>

                    <p>
                        {emailSent
                            ? `We have dispatched a password recovery link to ${email}. Check your inbox or spam folder.`
                            : "No worries! Enter your registered email address below, and we'll send you a link to reset your keypass."}
                    </p>
                </div>

                {!emailSent ? (
                    <form className="ForgotPasswordForm" onSubmit={handleSubmit}>
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
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="ForgotButton"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i> Dispatching Link...
                                </>
                            ) : (
                                <>
                                    <span>Send Recovery Link</span>
                                    <i className="bx bx-right-arrow-alt"></i>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <button
                        type="button"
                        className="ResendButton"
                        onClick={() => setEmailSent(false)}
                    >
                        <i className="bx bx-refresh"></i> Try Another Email
                    </button>
                )}

                <div className="ForgotFooter">
                    <Link to="/SignInUp" className="BackLink">
                        <i className="bx bx-arrow-back"></i>
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;