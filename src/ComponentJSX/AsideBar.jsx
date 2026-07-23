import React, { useEffect, useState } from 'react';
import '../ComponentCSS/AsideBar.css';
import { ResturantIG, midnightFoodData } from '../assets/assest';
import { Link, useLocation } from 'react-router-dom';
import api from "../config/axios";

const AsideBar = () => {
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const currentPath = location.pathname;

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

    const updateCartCount = async () => {
        try {
            const { data } = await api.get("/cart");
            const totalItems = data.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
            setCartCount(totalItems);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    return (
        <aside className="ProOceanicAside">
            <Link to='/'>
                <button className="Weblogo">
                    <img src={ResturantIG.WebLogo2} alt="Website Logo" />
                </button>
            </Link>

            <div className="asideNaviBtn">
                {/* HOME BUTTON */}
                <Link to={midnightFoodData.navigation.home}>
                    <button className={`NaviBox ${currentPath === midnightFoodData.navigation.home ? "active" : ""}`}>
                        <i className="fa-solid fa-house"></i>
                    </button>
                </Link>

                {/* MENU BUTTON */}
                <Link to={midnightFoodData.navigation.menu}>
                    <button className={`NaviBox ${currentPath === midnightFoodData.navigation.menu ? "active" : ""}`}>
                        <i className={`bx ${currentPath === midnightFoodData.navigation.menu ? "bxs-bowl-rice" : "bx-bowl-rice"}`}></i>
                    </button>
                </Link>

                {/* CART BUTTON */}
                <Link to={midnightFoodData.navigation.cart}>
                    <button className={`NaviBox cart-box ${currentPath === midnightFoodData.navigation.cart ? "active" : ""}`}>
                        <i className={`bx ${currentPath === midnightFoodData.navigation.cart ? "bxs-cart" : "bx-cart"}`}></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                </Link>
            </div>

            {/* Configured Settings Drop Box Footer Frame */}
            <div className="asideNaviSetting">
                <div className="NaviBox SettingsIconBox">
                    <i className="ri-settings-2-line"></i>
                </div>
                <div className="InsideNaviSetting">
                    <div className="DropSideSetting">
                        {midnightFoodData.asideSettings.links.map((link, idx) => (
                            <Link key={idx} to={link.path}>{link.label}</Link>
                        ))}

                        {/* ⚡ Theme Switch Toggle Row */}
                        <div className="ThemeToggleRowModule" onClick={toggleTheme}>
                            <div className="ToggleTextLabelHub">
                                <i className={theme === 'light-ocean' ? 'bx bx-sun' : 'bx bx-moon'}></i>
                                <span>{midnightFoodData.asideSettings.toggleLabel}</span>
                            </div>
                            <div className={`ProSwitchTrack ${theme === 'light-ocean' ? 'switch-on' : ''}`}>
                                <span className="ProSwitchThumb"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AsideBar;