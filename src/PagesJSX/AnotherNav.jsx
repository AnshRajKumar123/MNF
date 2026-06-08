import React, { useEffect, useState } from 'react'
import '../PagesCSS/AnotherNav.css'
import { Link } from 'react-router-dom'
import { ResturantIG } from '../assets/assest'

const AnotherNav = () => {

    const [userProfile, setUserProfile] = useState(null);

    // Load user profile
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("MNF_UserProfile"));
        setUserProfile(saved);

        // Listen for profile updates from Profile.jsx
        const handleUpdate = () => {
            const updated = JSON.parse(localStorage.getItem("MNF_UserProfile"));
            setUserProfile(updated);
        };

        window.addEventListener("profileUpdated", handleUpdate);

        return () => window.removeEventListener("profileUpdated", handleUpdate);
    }, []);

    return (
        <section className='AnotherNav'>
            <Link to='/' className="WebNavLogo">
                <img src={ResturantIG.WebLogo} />
                <h1>MidNight N Food</h1>
            </Link>

            <div className="AnotherNavLinks">
                <Link to='/mainWebsite' className='OnlyAccOpt'>Home</Link>
                <Link to='/mainWebsite/menu' className='OnlyAccOpt'>Menu</Link>
                <Link to='/mainWebsite/cart' className='OnlyAccOpt'>Cart</Link>
                <div className="AnotherNavDrop">
                    <div className="CircleBoxBtn">
                        <span>More</span>
                        <i className="ri-arrow-down-s-fill"></i>
                    </div>
                    <div className="BezPadding">
                        <div className="InsideBoxDrop">
                            <button onClick={() => { window.dispatchEvent(new Event('openOrderDetail')); localStorage.setItem('showOrderDetail', JSON.stringify(true)); }}>Order Tracking</button>
                            <Link to="/about"><button>About Us</button></Link>
                            <Link to="/report-fraud"><button>Report a Fraud</button></Link>
                            <Link to="/help-support"><button>Help and Support</button></Link>
                        </div>
                    </div>
                </div>

                <Link to='/profile'>
                    <button className="NaviAccount NaviAdd">
                        {userProfile?.image ? (
                            <img src={userProfile.image} className="NavProfileImg" />
                        ) : (
                            <span className="NavProfileLetter">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "A"}
                            </span>
                        )}
                    </button>
                </Link>
            </div>
        </section>
    )
}

export default AnotherNav