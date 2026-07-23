import React, { useState, useEffect } from 'react';
import AsideBar from './AsideBar';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import HomeSect from './HomeSect';
import { Route, Routes, Link } from 'react-router-dom';
import MenuSect from './MenuSect';
import SearchSect from './SearchSect';
import Cart from './Cart';
import { midnightFoodData } from '../assets/assest';

const MainSection = () => {
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

    // 🌊 SINGLE SOURCE OF TRUTH: Default to "light-ocean" (White Theme)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("MNF_OceanTheme") || "light-ocean";
    });

    useEffect(() => {
        if (theme === "light-ocean") {
            document.documentElement.setAttribute("data-theme", "light-ocean");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("MNF_OceanTheme", theme);
    }, [theme]);

    // Listen for theme updates triggered from other components
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

    const toggleDrawer = () => {
        setIsSideDrawerOpen(prev => !prev);
    };

    return (
        <div className="MainSectionRootContainer">
            <div className="FlexBoxNA">
                <AsideBar />

                <div className="NextToBT">
                    <Navbar onOpenMobileDrawer={toggleDrawer} />

                    <Routes>
                        <Route index element={<HomeSect />} />
                        <Route path='menu' element={<MenuSect />} />
                        <Route path='search' element={<SearchSect />} />
                        <Route path='cart' element={<Cart />} />
                    </Routes>
                </div>
            </div>

            {/* Fixed Bottom Navigation Bar (Mobile Only) */}
            <MobileBottomNav />

            {/* Slide-over Right Side Panel Drawer for Mobile Options */}
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
                            <i className={theme === "light-ocean" ? 'bx bx-sun' : 'bx bx-moon'}></i>
                            {theme === "light-ocean" ? "Light Ocean Mode" : "Dark Oceanic Mode"}
                        </span>

                        <button className={`ProThemeSwitchToggle ${theme === "light-ocean" ? "switch-active" : ""}`}>
                            <span className="SwitchThumb"></span>
                        </button>
                    </div>

                    <div className="DrawerBodyLinks">
                        {/* 👤 MOBILE ONLY: PROFILE BUTTON */}
                        <Link to="/profile" className="DrawerLinkItem ProfileDrawerCTA" onClick={toggleDrawer}>
                            <i className="bx bx-user-circle"></i> My Account Profile
                        </Link>

                        {/* DESKTOP ASSETS LINKS */}
                        {midnightFoodData.navMenuOptions.map((opt, idx) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainSection;