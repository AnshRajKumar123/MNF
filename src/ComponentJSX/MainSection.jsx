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
    const [theme, setTheme] = useState(() => localStorage.getItem("mnfTheme") || "dark-blue");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("mnfTheme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark-blue" ? "light-ocean" : "dark-blue"));
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
                    <div className="DrawerThemeToggleRow">
                        <span className="ThemeLabel">
                            <i className={theme === "dark-blue" ? 'bx bx-moon' : 'bx bx-sun'}></i>
                            {theme === "dark-blue" ? "Dark Oceanic Mode" : "Light Ocean Mode"}
                        </span>
                        
                        <button className={`ProThemeSwitchToggle ${theme === "light-ocean" ? "switch-active" : ""}`} onClick={toggleTheme}>
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