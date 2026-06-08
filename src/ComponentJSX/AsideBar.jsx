import React, { useEffect, useState } from 'react'
import '../ComponentCSS/AsideBar.css'
import { ResturantIG } from '../assets/assest'
import { Link, useLocation } from 'react-router-dom'

const AsideBar = () => {
    const [cartCount, setCartCount] = useState(0);

    // 📌 Get current URL
    const location = useLocation();
    const currentPath = location.pathname;

    // 📌 Function to get cart count from localStorage
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
        <aside>
            <Link to='/'>
                <button className="Weblogo">
                    <img src={ResturantIG.WebLogo} alt="Website Logo" />
                </button>
            </Link>

            <div className="asideNaviBtn">

                {/* HOME BUTTON */}
                <Link to='/mainWebsite'>
                    <button className={`NaviBox ${currentPath === "/mainWebsite" ? "active" : ""}`}>
                        <i className={`${currentPath === "/mainWebsite" ? "fa-solid" : "fa-solid"} fa-house`}></i>
                    </button>
                </Link>

                {/* MENU BUTTON */}
                <Link to='/mainWebsite/menu'>
                    <button className={`NaviBox ${currentPath === "/mainWebsite/menu" ? "active" : ""}`}>
                        <i className={`bx ${currentPath === "/mainWebsite/menu" ? "bxs-bowl-rice" : "bx-bowl-rice"}`}></i>
                    </button>
                </Link>

                {/* CART BUTTON */}
                <Link to='/mainWebsite/cart'>
                    <button className={`NaviBox cart-box ${currentPath === "/mainWebsite/cart" ? "active" : ""}`}>
                        <i className={`bx ${currentPath === "/mainWebsite/cart" ? "bxs-cart" : "bx-cart"}`}></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                </Link>

                {/* WALLET BUTTON */}
                {/* <button className="NaviBox">
                    <i className="ri-wallet-line"></i>
                </button> */}
            </div>

            <div className="asideNaviSetting">
                <div className="NaviBox">
                    <i className="ri-settings-2-line"></i>
                </div>
                <div className="InsideNaviSetting">
                    <div className="DropSideSetting">
                        <Link>Feedback</Link>
                        <Link>Bulk Order</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/about'>About Us</Link>
                        <Link>Terms and Conditions</Link>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default AsideBar