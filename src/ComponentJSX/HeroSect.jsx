import React, { useEffect, useState } from 'react';
import '../ComponentCSS/HeroSect.css';
import { ResturantIG, midnightHeroData } from '../assets/assest';
import FancyRope from './FancyRope';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const HeroSect = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const isLoggedIn = localStorage.getItem("mnfUserLoggedIn");
        if (isLoggedIn === "true") {
            navigate("/mainWebsite");
        } else {
            navigate("/SignInUp");
        }
    };

    useGSAP(() => {
        // High-end subtle pulsing micro-interaction for primary gate CTA
        gsap.to(".ProHeroAnimationButton", {
            boxShadow: "0 0 25px rgba(58, 134, 200, 0.6)",
            scale: 1.03,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Parallax image scrolling elements engine setup
        gsap.from(".ProMainMobileMock img", {
            y: 120,
            opacity: 0,
            duration: 0.9,
            scrollTrigger: {
                trigger: ".ProAppBentoSectionGrid",
                start: "top 80%",
            }
        });
    });

    return (
        <div className='ProHeroSuiteOverflowControl'>

            {/* MODULE 1: CINEMATIC VIDEO SCREEN GATEWAY */}
            <section className="ProCinematicHeroStage">
                <video src={ResturantIG.HeroVideo} autoPlay loop muted playsInline className="ProHeroFullVideoBg"></video>
                <div className="ProHeroMorphicGlassOverlay"></div>

                <div className="ProHeroCentralTypographyHub">
                    <h1 className="ProBrandMegaTitle">{midnightHeroData.hero.title}</h1>
                    <h2 className="ProBrandSubTag">{midnightHeroData.hero.subtitle}</h2>
                    <p className="ProBrandCoreDesc">{midnightHeroData.hero.desc}</p>

                    <div className="ProHeroMarketCTAsRow">
                        <button className="MarketBadgeBtn"><img src={ResturantIG.GooglePlay} alt="Play Store Link" /></button>
                        <button className="MarketBadgeBtn"><img src={ResturantIG.IOS} alt="App Store Link" /></button>
                    </div>

                    <button onClick={handleClick} className="ProHeroAnimationButton">
                        {midnightHeroData.hero.ctaWeb} <i className='bx bx-right-arrow-alt'></i>
                    </button>
                </div>
            </section>

            {/* MODULE 2: AMBIENT PARALLAX FLOATING ASSETS DECK */}
            <section className="ProParallaxRopeScenery">
                <div className="ParallaxRopeTrack">
                    <div className='MobileRopeHideWrapper'><FancyRope /></div>
                    <div className="FloatingAssetItem AssetBurger"><img src={ResturantIG.AbsoluteBurg} alt="" /></div>
                    <div className="FloatingAssetItem AssetPizza"><img src={ResturantIG.AbsolutePizz} alt="" /></div>
                    <div className="FloatingAssetItem AssetLeave"><img src={ResturantIG.AbsoluteLeav} alt="" /></div>
                    <div className="FloatingAssetItem AssetTomatoOne"><img src={ResturantIG.AbsoluteTom} alt="" /></div>
                    <div className="FloatingAssetItem AssetTomatoTwo"><img src={ResturantIG.AbsoluteTom} alt="" /></div>
                </div>

                <div className="ProLogisticsAboutCard">
                    <h2>{midnightHeroData.logistics.title}</h2>
                    <p>{midnightHeroData.logistics.desc}</p>
                </div>
            </section>

            {/* MODULE 3: THE HIGH-FI APPLICATION FEATURES BENTO MESH */}
            <section className="ProAppBentoSectionGrid">
                <div className="BentoSectionTypographyHeader">
                    <h2>{midnightHeroData.features.title}</h2>
                    <p>{midnightHeroData.features.desc}</p>
                </div>

                {/* Desktop High-Fi Core Layout Layer */}
                <div className="ProAppBentoMatrixCluster">
                    <div className="BentoCardColumn SideColumnLayout">
                        <div className="BentoMiniMetricSlotCard">
                            <img src={ResturantIG.healthy} alt="" />
                            <span>Healthy Parameter</span>
                        </div>
                        <div className="BentoMiniMetricSlotCard">
                            <img src={ResturantIG.VegMode} alt="" />
                            <span>Veg Protocol Mode</span>
                        </div>
                        <div className="BentoMiniMetricSlotCard SpanFullRowBlock">
                            <img src={ResturantIG.Party} alt="" />
                            <span>Plan a Party Infrastructure</span>
                        </div>
                    </div>

                    <div className="ProMainMobileMock">
                        <img src={ResturantIG.MainMobile} alt="MNF Engine Software Shell Mockup" />
                        <div className="BentoEmbeddedCalendarCard">
                            <img src={ResturantIG.Calendar} alt="" />
                            <span>{midnightHeroData.features.scheduleLabel}</span>
                        </div>
                    </div>

                    <div className="BentoCardColumn SideColumnLayout">
                        <div className="BentoMiniMetricSlotCard">
                            <img src={ResturantIG.Gourmet} alt="" />
                            <span>Gourmet Fleet</span>
                        </div>
                        <div className="BentoMiniMetricSlotCard">
                            <img src={ResturantIG.Offer} alt="" />
                            <span>Redeemable Discounts</span>
                        </div>
                        <div className="BentoMiniMetricSlotCard SpanFullRowBlock">
                            <img src={ResturantIG.Party} alt="" />
                            <span>Plan a Party Infrastructure</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Fallback Responsive Stack Node */}
                <div className="ProAppInfoBoxForMobile">
                    <div className="MobileFeaturesGridBox">
                        {[
                            { img: ResturantIG.Party, label: "Party Mode" },
                            { img: ResturantIG.VegMode, label: "Veg Protocol" },
                            { img: ResturantIG.healthy, label: "Healthy Stream" },
                            { img: ResturantIG.Gourmet, label: "Gourmet Hub" },
                            { img: ResturantIG.Offer, label: "Tokens" }
                        ].map((feat, idx) => (
                            <div key={idx} className="BentoMiniMetricSlotCard">
                                <img src={feat.img} alt="" />
                                <span>{feat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODULE 4: ECOSYSTEM HARDWARE INTEGRATION SCAN STATION */}
            <section className="ProDownloadConsoleStation">
                <div className="ProDownloadConsoleBentoCard">
                    <div className="DownloadConsoleLeftTypography">
                        <h2>{midnightHeroData.download.title}</h2>
                        <p>{midnightHeroData.download.desc}</p>

                        <div className="DownloadMarketBadgesRowDeck">
                            <button className="MarketBadgeBtn"><img src={ResturantIG.GooglePlay} alt="" /></button>
                            <button className="MarketBadgeBtn"><img src={ResturantIG.IOS} alt="" /></button>
                        </div>
                    </div>

                    <div className="DownloadConsoleRightGraphics">
                        <div className="ConsoleMobileCaseWrapper">
                            <img src={ResturantIG.MainMobile} alt="" />
                        </div>
                        <div className="ConsoleQrMatrixFrameBox">
                            <span>{midnightHeroData.download.qrLabel}</span>
                            <div className="QrImageShellWrapper">
                                <img src={ResturantIG.MidNightQR} alt="Ecosystem App Integration Token QR Code" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSect;