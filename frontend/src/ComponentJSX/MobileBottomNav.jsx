import React from 'react';
import { NavLink } from 'react-router-dom';
import '../ComponentCSS/Navbar.css';

const MobileBottomNav = () => {
    return (
        <div className="ProMobileBottomNavbar">
            <NavLink to="/mainWebsite" end className={({ isActive }) => `BottomTabItem ${isActive ? "tab-active" : ""}`}>
                <i className="bx bx-home-alt-2"></i>
                <span>Home</span>
            </NavLink>

            <NavLink to="/mainWebsite/menu" className={({ isActive }) => `BottomTabItem ${isActive ? "tab-active" : ""}`}>
                <i className="bx bx-restaurant"></i>
                <span>Menu</span>
            </NavLink>

            <NavLink to="/mainWebsite/search" className={({ isActive }) => `BottomTabItem ${isActive ? "tab-active" : ""}`}>
                <i className="bx bx-search"></i>
                <span>Search</span>
            </NavLink>

            <NavLink to="/mainWebsite/cart" className={({ isActive }) => `BottomTabItem ${isActive ? "tab-active" : ""}`}>
                <i className="bx bx-shopping-bag"></i>
                <span>Cart</span>
            </NavLink>
        </div>
    );
};

export default MobileBottomNav;