import React, { useEffect, useState } from "react";
import "../ComponentCSS/SignInUp.css";
import { ResturantIG } from "../assets/assest";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp, registerUser, loginUser } from "../services/authService";

const SignInUp = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showSignInPass, setShowSignInPass] = useState(false);
    const [showSignUpPass, setShowSignUpPass] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const [signUpData, setSignUpData] = useState({
        fullName: "",
        email: "",
        phone: "",
        otp: "",
        password: "",
    });

    useEffect(() => {
        if (localStorage.getItem("mnfUserLoggedIn") === "true") {
            navigate("/mainWebsite");
        }
    }, [navigate]);

    // Resend OTP Countdown
    useEffect(() => {
        let interval = null;
        if (otpTimer > 0) {
            interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleSendRegisterOtp = async () => {
        if (!signUpData.email || !/^\S+@\S+\.\S+$/.test(signUpData.email)) {
            return toast.error("Please enter a valid email address first.");
        }

        try {
            setSendingOtp(true);
            const res = await sendOtp(signUpData.email, "registration");
            toast.success(res.message || "OTP sent to your email!");
            setOtpSent(true);
            setOtpTimer(60);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send verification code.");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await loginUser(signInData.email, signInData.password);
            toast.success(res.message || "Signed in successfully!");
            localStorage.setItem("mnfUserLoggedIn", "true");
            window.location.href = "/mainWebsite";
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!otpSent || !signUpData.otp.trim()) {
            return toast.error("Please verify your email with the 6-digit OTP code.");
        }
        if (signUpData.password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        try {
            setLoading(true);
            const res = await registerUser(signUpData);
            toast.success(res.message || "Account created successfully! Please sign in.");
            setIsSignUp(false);
            setSignUpData({ fullName: "", email: "", phone: "", otp: "", password: "" });
            setOtpSent(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ProAuthOverlayWrapper">
            <div className={`ProAuthBentoContainer ${isSignUp ? "PanelStateShiftActive" : ""}`}>
                {/* ================= SIGN IN PANEL ================= */}
                <div className={`ProAuthFormBlock FirstSignUpSection ${isSignUp ? "AuthFormHiddenState" : ""}`}>
                    <div className="AuthFormHeaderBrand">
                        <img src={ResturantIG.WebLogo2} className="AuthBrandLogoImage" alt="MNF Logo" />
                        <h1>Welcome Back</h1>
                        <p className="AuthTaglineLabelText">Log in to track your dispatches and midnight feasts</p>
                    </div>

                    <form onSubmit={handleSignIn} className="FormClass">
                        <div className="ProAuthInputsVerticalStack">
                            <div className="ProAuthFieldInputRow">
                                <i className="bx bx-envelope input-leading-icon"></i>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={signInData.email}
                                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                />
                            </div>

                            <div className="ProAuthFieldInputRow">
                                <i className="bx bx-lock-alt input-leading-icon"></i>
                                <input
                                    type={showSignInPass ? "text" : "password"}
                                    placeholder="Enter password"
                                    required
                                    value={signInData.password}
                                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-trigger"
                                    onClick={() => setShowSignInPass((prev) => !prev)}
                                    aria-label="Toggle password"
                                >
                                    <i className={`bx ${showSignInPass ? "bx-show" : "bx-hide"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="AuthSubActionsRow">
                            <Link to="/forgot-password" className="AuthForgotSecretAction">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="ProAuthSubmitCTA" disabled={loading}>
                            {loading ? <i className="bx bx-loader-alt bx-spin"></i> : <span>Sign In</span>}
                        </button>
                    </form>

                    <div className="MobileAuthToggleFooter">
                        <span>Don't have an account?</span>
                        <button type="button" onClick={() => setIsSignUp(true)}>
                            Register Account
                        </button>
                    </div>
                </div>

                {/* ================= SIGN UP PANEL (NAME, GMAIL, PHONE, EMAIL OTP, PASSWORD) ================= */}
                <div className={`ProAuthFormBlock SecondSignUpSection ${isSignUp ? "" : "AuthFormHiddenState"}`}>
                    <div className="AuthFormHeaderBrand">
                        <img src={ResturantIG.WebLogo2} className="AuthBrandLogoImage" alt="MNF Logo" />
                        <h1>Create Account</h1>
                        <p className="AuthTaglineLabelText">Join us for fast midnight deliveries & special treats</p>
                    </div>

                    <form onSubmit={handleSignUp} className="FormClass">
                        <div className="ProAuthInputsVerticalStack">
                            <div className="ProAuthFieldInputRow">
                                <i className="bx bx-user input-leading-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={signUpData.fullName}
                                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                                />
                            </div>

                            <div className="ProAuthFieldInputRow">
                                <i className="bx bx-phone input-leading-icon"></i>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (e.g. 9876543210)"
                                    required
                                    value={signUpData.phone}
                                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                                />
                            </div>

                            {/* Email Input + In-Line "Send OTP" Button */}
                            <div className="ProAuthFieldInputRow WithInlineBtn">
                                <i className="bx bx-envelope input-leading-icon"></i>
                                <input
                                    type="email"
                                    placeholder="Gmail / Email Address"
                                    required
                                    value={signUpData.email}
                                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="InlineOtpActionBtn"
                                    onClick={handleSendRegisterOtp}
                                    disabled={sendingOtp || otpTimer > 0}
                                >
                                    {sendingOtp ? (
                                        <i className="bx bx-loader-alt bx-spin"></i>
                                    ) : otpTimer > 0 ? (
                                        `${otpTimer}s`
                                    ) : otpSent ? (
                                        "Resend"
                                    ) : (
                                        "Send OTP"
                                    )}
                                </button>
                            </div>

                            {/* OTP Field (Reveals upon sending) */}
                            {otpSent && (
                                <div className="ProAuthFieldInputRow HighlightOtpRow">
                                    <i className="bx bx-shield-quarter input-leading-icon"></i>
                                    <input
                                        type="text"
                                        placeholder="6-Digit OTP Code"
                                        maxLength="6"
                                        required
                                        value={signUpData.otp}
                                        onChange={(e) => setSignUpData({ ...signUpData, otp: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="ProAuthFieldInputRow">
                                <i className="bx bx-lock-alt input-leading-icon"></i>
                                <input
                                    type={showSignUpPass ? "text" : "password"}
                                    placeholder="Create Password (min 6 chars)"
                                    required
                                    value={signUpData.password}
                                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-trigger"
                                    onClick={() => setShowSignUpPass((prev) => !prev)}
                                    aria-label="Toggle password"
                                >
                                    <i className={`bx ${showSignUpPass ? "bx-show" : "bx-hide"}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="ProAuthSubmitCTA" disabled={loading}>
                            {loading ? <i className="bx bx-loader-alt bx-spin"></i> : <span>Complete Registration</span>}
                        </button>
                    </form>

                    <div className="MobileAuthToggleFooter">
                        <span>Already registered?</span>
                        <button type="button" onClick={() => setIsSignUp(false)}>
                            Sign In
                        </button>
                    </div>
                </div>

                {/* ================= DESKTOP SLIDING BENTO PANEL ================= */}
                <div className="ProAuthSlidingConsolePanel">
                    <div className="SlidingConsoleContentBody">
                        {!isSignUp ? (
                            <div className="ConsoleStateNodeAnimate">
                                <h1>New to MidNight Food?</h1>
                                <p>Create your verified account in seconds and unlock late-night delivery specials.</p>
                                <button className="ConsolePanelTriggerBtn" onClick={() => setIsSignUp(true)}>
                                    Register Account
                                </button>
                            </div>
                        ) : (
                            <div className="ConsoleStateNodeAnimate">
                                <h1>Welcome Back!</h1>
                                <p>Already have an account? Sign in to resume tracking your orders.</p>
                                <button className="ConsolePanelTriggerBtn" onClick={() => setIsSignUp(false)}>
                                    Sign In Instead
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInUp;