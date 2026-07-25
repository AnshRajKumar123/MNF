import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../../admin/src/components/ui/Card";
import Input from "../../admin/src/components/ui/Input";
import Button from "../../admin/src/components/ui/Button";

import { forgotPassword } from "../services/";

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

            <Card className="ForgotPasswordCard">

                <div className="ForgotPasswordHeader">

                    <div className="ForgotIcon">
                        <i className="bx bx-lock-open-alt"></i>
                    </div>

                    <h1>Forgot Password</h1>

                    <p>
                        Enter the email address associated with your account.
                        We'll send you a secure password reset link.
                    </p>

                </div>

                <form
                    className="ForgotPasswordForm"
                    onSubmit={handleSubmit}
                >

                    <Input
                        icon="bx bx-envelope"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>

                </form>

                <div className="ForgotFooter">

                    <Link to="/login">
                        <i className="bx bx-arrow-back"></i>
                        Back to Login
                    </Link>

                </div>

            </Card>

        </div>

    );

};

export default ForgotPassword;