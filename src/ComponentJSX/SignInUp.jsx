import React, { useState } from "react";
import "../ComponentCSS/SignInUp.css";
import { ResturantIG, midnightAuthData } from "../assets/assest";
import { useNavigate } from "react-router-dom";

const SignInUp = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.setItem("mnfUserLoggedIn", "true");
        navigate("/mainWebsite");
    };

    const handleSignUp = () => {
        localStorage.setItem("mnfUserLoggedIn", "true");
        navigate("/mainWebsite");
    };

    return (
        <div className="ProAuthOverlayWrapper">
            <div className={`ProAuthBentoContainer ${isSignUp ? "PanelStateShiftActive" : ""}`}>

                {/* ================= LEFT / RIGHT LAYER: SIGN IN FORM ================= */}
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

                    <div className="ProAuthInputsVerticalStack">
                        <div className="ProAuthFieldInputRow">
                            <input type="email" placeholder="Email or Security Number" required />
                        </div>
                        <div className="ProAuthFieldInputRow">
                            <input type="number" placeholder="One-Time PIN (OTP)" />
                        </div>
                    </div>

                    <p className="AuthForgotSecretAction">{midnightAuthData.signIn.forgotText}</p>

                    <button className="ProAuthSubmitCTA" onClick={handleLogin}>
                        Sign In <i className='bx bx-log-in-circle'></i>
                    </button>
                </div>

                {/* ================= LEFT / RIGHT LAYER: SIGN UP FORM ================= */}
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

                    <div className="ProAuthInputsVerticalStack">
                        <div className="ProAuthFieldInputRow">
                            <input type="text" placeholder="Full Identity Name" />
                        </div>
                        <div className="ProAuthFieldInputRow">
                            <input type="email" placeholder="Email Vector Link" required />
                        </div>
                        <div className="ProAuthFieldInputRow">
                            <input type="number" placeholder="Request Verification OTP" />
                        </div>
                    </div>

                    <button className="ProAuthSubmitCTA" onClick={handleSignUp}>
                        Sign Up <i className='bx bx-user-plus'></i>
                    </button>
                </div>

                {/* ================= SLIDING CONSOLE CONTENT SIDEBAR ================= */}
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