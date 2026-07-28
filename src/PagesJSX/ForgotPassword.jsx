import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService";
import "../PagesCSS/ForgotPassword.css";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        try {

            setLoading(true);

            const data = await forgotPassword(email);

            toast.success(data.message);

            setEmail("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to send reset email."
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="ForgotPasswordPage">

            <div className="ForgotPasswordCard">

                <div className="ForgotPasswordHeader">

                    <div className="ForgotIcon">
                        <i className="bx bx-lock-open-alt"></i>
                    </div>

                    <h1>Forgot Password</h1>

                    <p>
                        Enter your registered email address.
                        We'll send you a password reset link.
                    </p>

                </div>

                <form
                    className="ForgotPasswordForm"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="email"
                        className="ForgotInput"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="ForgotButton"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                <div className="ForgotFooter">

                    <Link to="/SignInUp">
                        <i className="bx bx-arrow-back"></i>
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );

};

export default ForgotPassword;