import React, { useEffect, useState } from 'react';
import '../PagesCSS/AnotherNav.css';
import { Link } from 'react-router-dom';
import { ResturantIG, midnightFoodData } from '../assets/assest';
import axios from "axios";
import { API_URL } from "../config/api";

const AnotherNav = () => {
    const [userProfile, setUserProfile] = useState(null);

    // 🌊 Oceanic Theme Runtime Toggle Synchronization State Machine Engine
    const [isLightOcean, setIsLightOcean] = useState(() => {
        const savedTheme = localStorage.getItem('MNF_OceanTheme');
        return savedTheme === 'light-ocean';
    });

    useEffect(() => {
        if (isLightOcean) {
            document.documentElement.setAttribute('data-theme', 'light-ocean');
            localStorage.setItem('MNF_OceanTheme', 'light-ocean');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('MNF_OceanTheme', 'dark-blue');
        }
    }, [isLightOcean]);

    useEffect(() => {

        const fetchProfile = async () => {
            try {

                const response = await axios.get(
                    `${API_URL}/auth/profile`,
                    {
                        withCredentials: true,
                    }
                );

                const user = response.data.user;

                setUserProfile({
                    name: user.fullName,
                    image: user.image,
                });

            } catch (error) {

                console.log(error);

            }
        };

        fetchProfile();

        window.addEventListener("profileUpdated", fetchProfile);

        return () => {
            window.removeEventListener("profileUpdated", fetchProfile);
        };

    }, []);

    return (
        <section className='ProOceanicAnotherNav'>
            <Link to='/' className="WebNavLogo">
                <img src={ResturantIG.WebLogo} alt="Corporate Logo" />
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

                            <div className="DropdownThemeToggleRow" onClick={() => setIsLightOcean(!isLightOcean)}>
                                <div className="DropdownToggleLabelHub">
                                    <i className={isLightOcean ? 'bx bx-sun' : 'bx bx-moon'}></i>
                                    <span>{midnightFoodData.asideSettings.toggleLabel}</span>
                                </div>
                                <div className={`ProDropdownSwitchTrack ${isLightOcean ? 'switch-on' : ''}`}>
                                    <span className="ProDropdownSwitchThumb"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Link to='/profile'>
                    <button className="NaviAccount NaviAdd">
                        {userProfile?.image ? (
                            <img
                                src={`${API_URL}${userProfile.image}`}
                                className="NavProfileImg"
                                alt="Profile"
                            />
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