import React, { useState } from "react";
import "../ComponentCSS/SignInUp.css";
import { ResturantIG, midnightAuthData } from "../assets/assest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";

const SignInUp = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const [signUpData, setSignUpData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    const handleSignInChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUpChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/auth/register`,
                signUpData
            );

            toast.success(response.data.message);
            setIsSignUp(false); // Auto-switch to sign-in after successful registration

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/auth/login`,
                signInData,
                {
                    withCredentials: true,
                }
            );

            toast.success(response.data.message);
            navigate("/mainWebsite");

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="ProAuthOverlayWrapper">
            <div className={`ProAuthBentoContainer ${isSignUp ? "PanelStateShiftActive" : ""}`}>

                {/* ================= SIGN IN FORM ================= */}
                <div className={`ProAuthFormBlock FirstSignUpSection ${isSignUp ? "AuthFormHiddenState" : ""}`}>
                    <div className="AuthFormHeaderBrand">
                        <img src={ResturantIG.WebLogo} className="AuthBrandLogoImage" alt="MNF Logo" />
                        <h1>{midnightAuthData.signIn.title}</h1>
                    </div>

                    <div className="ProSocialAuthRow">
                        <div className="SocialIconCell"><i className="bx bxl-facebook"></i></div>
                        <div className="SocialIconCell"><i className="bx bxl-google"></i></div>
                        <div className="SocialIconCell"><i className="bx bxl-linkedin"></i></div>
                    </div>

                    <p className="AuthTaglineLabelText">{midnightAuthData.signIn.tagline}</p>

                    <form onSubmit={handleSignIn} className="FormClass">
                        <div className="ProAuthInputsVerticalStack">
                            <div className="ProAuthFieldInputRow">
                                <input name="email" type="email" placeholder="Email" required value={signInData.email} onChange={handleSignInChange} />
                            </div>
                            <div className="ProAuthFieldInputRow">
                                <input name="password" type="password" placeholder="Password" required value={signInData.password} onChange={handleSignInChange} />
                            </div>
                        </div>

                        <p className="AuthForgotSecretAction">{midnightAuthData.signIn.forgotText}</p>

                        <button type="submit" className="ProAuthSubmitCTA">
                            Sign In <i className='bx bx-log-in-circle'></i>
                        </button>
                    </form>

                    {/* 📱 MOBILE ONLY: TOGGLE TO SIGN UP */}
                    <div className="MobileAuthToggleFooter">
                        <span>Don't have an account?</span>
                        <button type="button" onClick={() => setIsSignUp(true)}>
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* ================= SIGN UP FORM ================= */}
                <div className={`ProAuthFormBlock SecondSignUpSection ${isSignUp ? "" : "AuthFormHiddenState"}`}>
                    <div className="AuthFormHeaderBrand">
                        <img src={ResturantIG.WebLogo} className="AuthBrandLogoImage" alt="MNF Logo" />
                        <h1>{midnightAuthData.signUp.title}</h1>
                    </div>

                    <div className="ProSocialAuthRow">
                        <div className="SocialIconCell"><i className="bx bxl-facebook"></i></div>
                        <div className="SocialIconCell"><i className="bx bxl-google"></i></div>
                        <div className="SocialIconCell"><i className="bx bxl-linkedin"></i></div>
                    </div>

                    <p className="AuthTaglineLabelText">{midnightAuthData.signUp.tagline}</p>

                    <form onSubmit={handleSignUp} className="FormClass">
                        <div className="ProAuthInputsVerticalStack">
                            <div className="ProAuthFieldInputRow">
                                <input name="fullName" type="text" placeholder="Full Name" required value={signUpData.fullName} onChange={handleSignUpChange} />
                            </div>
                            <div className="ProAuthFieldInputRow">
                                <input name="email" type="email" placeholder="Email" required value={signUpData.email} onChange={handleSignUpChange} />
                            </div>
                            <div className="ProAuthFieldInputRow">
                                <input name="password" type="password" placeholder="Password" required value={signUpData.password} onChange={handleSignUpChange} />
                            </div>
                        </div>

                        <button type="submit" className="ProAuthSubmitCTA">
                            Sign Up <i className="bx bx-user-plus"></i>
                        </button>
                    </form>

                    {/* 📱 MOBILE ONLY: TOGGLE TO SIGN IN */}
                    <div className="MobileAuthToggleFooter">
                        <span>Already have an account?</span>
                        <button type="button" onClick={() => setIsSignUp(false)}>
                            Sign In
                        </button>
                    </div>
                </div>

                {/* ================= SLIDING CONSOLE CONTENT SIDEBAR (DESKTOP) ================= */}
                <div className="ProAuthSlidingConsolePanel">
                    <div className="MorphicPanelGraphicsAnchor">
                        <div className="MorphicAssetVector AbsoluteBurgerAsset"><img src={ResturantIG.AbsoluteBurg} alt="" /></div>
                        <div className="MorphicAssetVector AbsolutePizzaAsset"><img src={ResturantIG.AbsolutePizz} alt="" /></div>
                    </div>

                    <div className="SlidingConsoleContentBody">
                        {!isSignUp ? (
                            <div className="ConsoleStateNodeAnimate">
                                <h1>{midnightAuthData.panels.greetTitle}</h1>
                                <p>{midnightAuthData.panels.greetDesc}</p>
                                <button className="ConsolePanelTriggerBtn" onClick={() => setIsSignUp(true)}>
                                    {midnightAuthData.panels.greetBtn}
                                </button>
                            </div>
                        ) : (
                            <div className="ConsoleStateNodeAnimate">
                                <h1>{midnightAuthData.panels.welcomeTitle}</h1>
                                <p>{midnightAuthData.panels.welcomeDesc}</p>
                                <button className="ConsolePanelTriggerBtn" onClick={() => setIsSignUp(false)}>
                                    {midnightAuthData.panels.welcomeBtn}
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