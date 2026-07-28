import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your admin email address.");
            return;
        }

        try {
            setLoading(true);
            const data = await forgotPassword(email);
            toast.success(data.message || "Reset link dispatched to admin node!");
            setEmailSent(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to dispatch reset authorization email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="AdminForgotPage">
            {/* Ambient Lighting Orbs */}
            <div className="AdminGlowSphere GlowTopLeft"></div>
            <div className="AdminGlowSphere GlowBottomRight"></div>

            <div className="AdminForgotCard">
                <div className="AdminForgotHeader">
                    <div className="AdminForgotLogoBadge">
                        <i className={emailSent ? "bx bx-mail-send" : "bx bx-shield-quarter"}></i>
                    </div>

                    <span className="SecurityNodePill">
                        <span className="PulseDot"></span> CREDENTIAL RECOVERY NODE
                    </span>

                    <h1>{emailSent ? "Recovery Link Dispatched" : "Admin Password Recovery"}</h1>

                    <p>
                        {emailSent
                            ? `Reset authorization has been transmitted to ${email}. Please check your secure mailbox.`
                            : "Enter your registered administrative email to generate an authorized keypass reset token."}
                    </p>
                </div>

                {!emailSent ? (
                    <form className="AdminForgotForm" onSubmit={handleSubmit}>
                        <div className="InputGroupSlot">
                            <label className="FieldLabel">Admin Email Terminal</label>
                            <div className="InputWrapper">
                                <i className="bx bx-envelope InputIcon"></i>
                                <input
                                    type="email"
                                    className="AdminForgotInput"
                                    placeholder="admin@midnightfood.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="AdminForgotSubmitBtn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i> Authenticating...
                                </>
                            ) : (
                                <>
                                    <span>Dispatch Reset Link</span>
                                    <i className="bx bx-right-arrow-alt"></i>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <button
                        type="button"
                        className="TryAnotherEmailBtn"
                        onClick={() => setEmailSent(false)}
                    >
                        <i className="bx bx-refresh"></i> Re-enter Admin Email
                    </button>
                )}

                <div className="AdminForgotFooter">
                    <Link to="/" className="BackToLoginLink">
                        <i className="bx bx-arrow-back"></i>
                        <span>Return to Admin Console</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;