import React, { useEffect, useState } from 'react';
import '../PagesCSS/AnotherNav.css';
import { Link } from 'react-router-dom';
import { ResturantIG, midnightFoodData } from '../assets/assest';

const AnotherNav = () => {
    const [userProfile, setUserProfile] = useState(null);

    // Load user profile from localStorage securely[cite: 14]
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("MNF_UserProfile"));
        setUserProfile(saved);

        const handleUpdate = () => {
            const updated = JSON.parse(localStorage.getItem("MNF_UserProfile"));
            setUserProfile(updated);
        };

        window.addEventListener("profileUpdated", handleUpdate);
        return () => window.removeEventListener("profileUpdated", handleUpdate);
    }, []);

    return (
        <section className='ProOceanicAnotherNav'>
            <Link to='/' className="WebNavLogo">
                <img src={ResturantIG.WebLogo} alt="Corporate Logo" className="NavLogoWhiteFilter" />
                <h1>{midnightFoodData.branding.title}</h1>
            </Link>

            <div className="AnotherNavLinks">
                <Link to={midnightFoodData.navigation.home} className='OnlyAccOpt'>Home</Link>
                <Link to={midnightFoodData.navigation.menu} className='OnlyAccOpt'>Menu</Link>
                <Link to={midnightFoodData.navigation.cart} className='OnlyAccOpt'>Cart</Link>

                <div className="AnotherNavDrop">
                    <div className="CircleBoxBtn">
                        <span>{midnightFoodData.anotherNav.moreLabel}</span>
                        <i className="ri-arrow-down-s-fill"></i>
                    </div>
                    <div className="BezPadding">
                        <div className="InsideBoxDrop">
                            {midnightFoodData.anotherNav.options.map((opt, idx) => (
                                opt.action ? (
                                    <button key={idx} onClick={() => {
                                        window.dispatchEvent(new Event(opt.action));
                                        localStorage.setItem('showOrderDetail', JSON.stringify(true));
                                    }}>{opt.label}</button>
                                ) : (
                                    <Link key={idx} to={opt.path}><button>{opt.label}</button></Link>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                <Link to='/profile'>
                    <button className="NaviAccount NaviAdd">
                        {userProfile?.image ? (
                            <img src={userProfile.image} className="NavProfileImg" alt="" />
                        ) : (
                            <span className="NavProfileLetter">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "A"}
                            </span>
                        )}
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default AnotherNav;