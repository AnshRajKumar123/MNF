import React from 'react'
import '../ComponentCSS/HeroSect.css'
import { ResturantIG } from '../assets/assest'
import Footer from './Footer'
import FancyRope from './FancyRope'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate } from 'react-router-dom'
gsap.registerPlugin(ScrollTrigger);

const HeroSect = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        const isLoggedIn = localStorage.getItem("mnfUserLoggedIn");

        if (isLoggedIn === "true") {
            // user already logged in → direct to main website
            navigate("/mainWebsite");
        } else {
            // not logged in → go to login page first
            navigate("/SignInUp");
        }
    };

    useGSAP(() => {
        gsap.to(".AnimationButton", {
            y: 50,
            duration: 0.9,
            repeat: -1,
            yoyo: true
        })

        gsap.from(".AppInfoBox .MainMobile", {
            y: 400,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: {
                trigger: ".AppSection .MainMobile",
                start: "top 120%",   // when 80% of viewport hits top of element
            }
        })
    })

    return (
        <>
            <div className='OverFlowHidden'>
                <section className="VideoATitle">
                    <video src={ResturantIG.HeroVideo} autoPlay loop muted playsInline className="FullVideo"></video>
                    <div className="Opactiy"></div>
                    <div className="AboutAPP">
                        <h1>MNF</h1>
                        <h2>food delivery app</h2>
                        <p>Experience fast & easy online ordering <br /> on the MNF App</p>

                        <div className="APPBtn">
                            <button>
                                <img src={ResturantIG.GooglePlay} />
                            </button>

                            <button>
                                <img src={ResturantIG.IOS} />
                            </button>
                        </div>

                        <button onClick={handleClick} className="AnimationButton">Visit Our Website!!</button>
                    </div>
                </section>

                <section className='RopeSection'>
                    <div className='RopeFancy'>
                        <div className='DivForMobile'>
                            <FancyRope />
                        </div>
                        <div className="Burger"><img src={ResturantIG.AbsoluteBurg} /></div>
                        <div className='Pizaa'><img src={ResturantIG.AbsolutePizz} /></div>
                        <div className="Leave"><img src={ResturantIG.AbsoluteLeav} /></div>
                        <div className="Tomato"><img src={ResturantIG.AbsoluteTom} /></div>
                        <div className="Tomato NumberTwo"><img src={ResturantIG.AbsoluteTom} /></div>
                    </div>

                    <div className="AboutInfoFree">
                        <h1>MNF: Powering <br />Tomorrow's Logistics</h1>
                        <p>For over a decade, we've provided <br />
                            cutting logistics and supply chain <br />
                            solutions, connecting busineses globally.</p>
                    </div>
                </section>

                <section className='AppSection'>
                    <h1>What’s waiting for you <br /> on the app?</h1>
                    <p>Our app is packed with features that <br /> enable you to experience food <br /> delivery like never before</p>

                    <div className="AppInfoBox">
                        <div className='ThreeTypeHereL'>
                            <div className='DisplayFlex'>
                                <div className="boxSect">
                                    <img src={ResturantIG.healthy} />
                                    <span>Healthy</span>
                                </div>
                                <div className="boxSect boxpadding">
                                    <img src={ResturantIG.VegMode} />
                                    <span>Veg Mode</span>
                                </div>
                            </div>
                            <div className="boxSect">
                                <img src={ResturantIG.Party} />
                                <span>Plan a Party</span>
                            </div>
                        </div>
                        <div className='MainMobile'>
                            <img src={ResturantIG.MainMobile} />
                            <div className='Calendar'>
                                <img src={ResturantIG.Calendar} />
                                <span>Schedule <br /> your order</span>
                            </div>
                        </div>
                        <div className='ThreeTypeHereL'>
                            <div className='DisplayFlex'>
                                <div className="boxSect">
                                    <img src={ResturantIG.Gourmet} />
                                    <span>Gourmet</span>
                                </div>
                                <div className="boxSect boxpadding">
                                    <img src={ResturantIG.Offer} />
                                    <span>Offer</span>
                                </div>
                            </div>
                            <div className="boxSect">
                                <img src={ResturantIG.Party} />
                                <span>Plan a Party</span>
                            </div>
                        </div>
                    </div>

                    <div className="AppInfoBoxForMobile">
                        <div className="InsideBoxMobileOf">
                            <div className="ThreeLineOfMobile">
                                <div className="boxSect">
                                    <img src={ResturantIG.Party} />
                                    <span>Plan a Party</span>
                                </div>
                                <div className="boxSect boxpadding">
                                    <img src={ResturantIG.VegMode} />
                                    <span>Veg Mode</span>
                                </div>
                            </div>

                            <div className='ThreeLineOfMobile BezMargin'>
                                <div className="boxSect">
                                    <img src={ResturantIG.healthy} />
                                    <span>Healthy</span>
                                </div>
                                <div className="boxSect">
                                    <img src={ResturantIG.Gourmet} />
                                    <span>Gourmet</span>
                                </div>
                            </div>

                            <div className='ThreeLineOfMobile'>
                                <div className="boxSect boxpadding">
                                    <img src={ResturantIG.Offer} />
                                    <span>Offer</span>
                                </div>
                                <div className="boxSect">
                                    <img src={ResturantIG.Party} />
                                    <span>Plan a Party</span>
                                </div>
                            </div>
                        </div>

                        <p>...and a lot more</p>
                    </div>
                </section>

                <section className='DownloadApp'>
                    <div className="InsideBoxDown">
                        <div className="InfoAppDownload">
                            <h1>Download the app now!</h1>
                            <p>Experience seamless online ordering <br />only on the Zomato app</p>

                            <div className="DownloadButton">
                                <button>
                                    <img src={ResturantIG.GooglePlay} />
                                </button>

                                <button>
                                    <img src={ResturantIG.IOS} />
                                </button>
                            </div>
                        </div>
                        <div className="ImageAppDownload">
                            <div className='MobileCase'>
                                <img src={ResturantIG.MainMobile} />
                            </div>
                            <div className="MobileQRCode">
                                <span>Scan the QR code to download the app</span>
                                <img src={ResturantIG.MidNightQR} />

                                <div className="greenColor"></div>
                            </div>
                        </div>
                    </div>

                    <div className='DownloadAppSectionForMobile'>
                        <div className="ImageBoxMobile">
                            <img src={ResturantIG.AppMobileView} />
                        </div>

                        <div className="AboutInfoMobile">
                            <h1>Download the app now!!</h1>
                            <p>Experience seamless food ordering <br /> with the MNF App</p>

                            <div className="APPBtn">
                                <button>
                                    <img src={ResturantIG.GooglePlay} />
                                </button>

                                <button>
                                    <img src={ResturantIG.IOS} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default HeroSect