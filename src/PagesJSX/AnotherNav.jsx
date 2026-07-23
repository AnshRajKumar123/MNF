import React, { useEffect, useState } from 'react';
import '../PagesCSS/AnotherNav.css';
import { Link, useNavigate } from 'react-router-dom';
import { ResturantIG, midnightFoodData } from '../assets/assest';
import axios from "axios";
import { API_URL } from "../config/api";

const AnotherNav = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // 🌊 Default Theme: White/Light Ocean
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('MNF_OceanTheme') || 'light-ocean';
    });

    useEffect(() => {
        if (theme === 'light-ocean') {
            document.documentElement.setAttribute('data-theme', 'light-ocean');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('MNF_OceanTheme', theme);
    }, [theme]);

    useEffect(() => {
        const handleSync = () => {
            const current = localStorage.getItem("MNF_OceanTheme") || "light-ocean";
            setTheme(current);
        };
        window.addEventListener("mnfThemeChanged", handleSync);
        return () => window.removeEventListener("mnfThemeChanged", handleSync);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "light-ocean" ? "dark-blue" : "light-ocean";
        setTheme(nextTheme);
        localStorage.setItem("MNF_OceanTheme", nextTheme);
        window.dispatchEvent(new Event("mnfThemeChanged"));
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/auth/profile`,
                    { withCredentials: true }
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
        return () => window.removeEventListener("profileUpdated", fetchProfile);
    }, []);

    const toggleDrawer = () => {
        setIsSideDrawerOpen(prev => !prev);
    };

    return (
        <>
            <section className='ProOceanicAnotherNav'>
                {/* BRAND LOGO */}
                <Link to='/' className="WebNavLogo">
                    <img src={ResturantIG.WebLogo} alt="Corporate Logo" />
                    <h1>{midnightFoodData.branding.title}</h1>
                </Link>

                {/* DESKTOP LINKS & DROPDOWN */}
                <div className="AnotherNavLinks DesktopNavLinksOnly">
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

                                <div className="DropdownThemeToggleRow" onClick={toggleTheme}>
                                    <div className="DropdownToggleLabelHub">
                                        <i className={theme === 'light-ocean' ? 'bx bx-sun' : 'bx bx-moon'}></i>
                                        <span>{midnightFoodData.asideSettings.toggleLabel}</span>
                                    </div>
                                    <div className={`ProDropdownSwitchTrack ${theme === 'light-ocean' ? 'switch-on' : ''}`}>
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

                {/* MOBILE ONLY TOP ACTION BUTTONS */}
                <div className="MobileNavActions">
                    <button className="MobileSearchIconBtn" onClick={() => navigate('/mainWebsite/search')}>
                        <i className="ri-search-line"></i>
                    </button>
                    <button className="MobileBarMenuBtn" onClick={toggleDrawer}>
                        <i className="ri-menu-3-line"></i>
                    </button>
                </div>
            </section>

            {/* SLIDE-OVER RIGHT SIDE PANEL DRAWER (MOBILE ONLY) */}
            <div className={`ProMobileSideDrawerOverlay ${isSideDrawerOpen ? "drawer-open" : ""}`} onClick={toggleDrawer}>
                <div className="ProMobileDrawerPanel" onClick={(e) => e.stopPropagation()}>
                    <div className="DrawerHeader">
                        <h3>Navigation Menu</h3>
                        <button className="CloseDrawerBtn" onClick={toggleDrawer}>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>

                    {/* 🌗 THEME TOGGLE BUTTON ROW */}
                    <div className="DrawerThemeToggleRow" onClick={toggleTheme}>
                        <span className="ThemeLabel">
                            <i className={theme === 'light-ocean' ? 'bx bx-sun' : 'bx bx-moon'}></i>
                            {theme === 'light-ocean' ? "Light Ocean Mode" : "Dark Oceanic Mode"}
                        </span>

                        <div className={`ProThemeSwitchToggle ${theme === 'light-ocean' ? "switch-active" : ""}`}>
                            <span className="SwitchThumb"></span>
                        </div>
                    </div>

                    <div className="DrawerBodyLinks">
                        {/* HOME LINK */}
                        <Link to={midnightFoodData.navigation.home} className="DrawerLinkItem" onClick={toggleDrawer}>
                            <i className="bx bx-home-alt-2"></i> Home
                        </Link>

                        {/* MENU LINK */}
                        <Link to={midnightFoodData.navigation.menu} className="DrawerLinkItem" onClick={toggleDrawer}>
                            <i className="bx bx-restaurant"></i> Menu
                        </Link>

                        {/* CART LINK */}
                        <Link to={midnightFoodData.navigation.cart} className="DrawerLinkItem" onClick={toggleDrawer}>
                            <i className="bx bx-shopping-bag"></i> Cart
                        </Link>

                        {/* MORE OPTIONS */}
                        {midnightFoodData.anotherNav.options.map((opt, idx) => (
                            opt.action ? (
                                <button key={idx} className="DrawerLinkItem" onClick={() => {
                                    window.dispatchEvent(new Event(opt.action));
                                    localStorage.setItem('showOrderDetail', JSON.stringify(true));
                                    toggleDrawer();
                                }}>
                                    {opt.label}
                                </button>
                            ) : (
                                <Link key={idx} to={opt.path} className="DrawerLinkItem" onClick={toggleDrawer}>
                                    {opt.label}
                                </Link>
                            )
                        ))}

                        {/* PROFILE LINK */}
                        <Link to="/profile" className="DrawerLinkItem ProfileDrawerCTA" onClick={toggleDrawer}>
                            <i className="bx bx-user-circle"></i> My Account Profile
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnotherNav;