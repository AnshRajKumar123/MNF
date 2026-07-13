import React, { useEffect, useState } from 'react';
import '../ComponentCSS/AsideBar.css';
import { ResturantIG, midnightFoodData } from '../assets/assest';
import { Link, useLocation } from 'react-router-dom';

const AsideBar = () => {
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const currentPath = location.pathname;

    // 🌊 Oceanic Theme Runtime Toggle State Machine Engine
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

    const updateCartCount = () => {
        const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartCount(savedCart.length);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <aside className="ProOceanicAside">
            <Link to='/'>
                <button className="Weblogo">
                    <img src={ResturantIG.WebLogo} alt="Website Logo" />
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

                        {/* ⚡ High-End Integrated Interactive Switch Module Row */}
                        <div className="ThemeToggleRowModule" onClick={() => setIsLightOcean(!isLightOcean)}>
                            <div className="ToggleTextLabelHub">
                                <i className={isLightOcean ? 'bx bx-sun' : 'bx bx-moon'}></i>
                                <span>{midnightFoodData.asideSettings.toggleLabel}</span>
                            </div>
                            <div className={`ProSwitchTrack ${isLightOcean ? 'switch-on' : ''}`}>
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