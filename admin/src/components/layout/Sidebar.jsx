import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Sidebar.css";
import { ResturantIG } from '../../../../src/assets/assest'

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "bx-grid-alt" },
        { path: "/products", label: "Products", icon: "bx-dish" },
        { path: "/orders", label: "Orders", icon: "bx-receipt" },
        { path: "/users", label: "Users", icon: "bx-user-check" },
        { path: "/coupons", label: "Coupons", icon: "bx-purchase-tag-alt" },
        { path: "/settings", label: "Settings", icon: "bx-cog" },
    ];

    return (
        <aside className={`AdminSidebar ${isMobileOpen ? "sidebar-mobile-open" : ""}`}>
            {/* BRANDING HEADER */}
            <div className="SidebarBrandHeader">
                <div className="BrandLogoBadge">
                    <img src={ResturantIG.WebLogo2} />
                </div>
                <div className="BrandTitleGroup">
                    <h2>MNF ADMIN</h2>
                    <span>Control Console</span>
                </div>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="SidebarNavDeck">
                <span className="SidebarSectionTag">MAIN MENU</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `SidebarLinkNode ${isActive ? "active-link" : ""}`
                        }
                        onClick={closeMobileSidebar}
                    >
                        <i className={`bx ${item.icon} LinkIcon`}></i>
                        <span className="LinkLabel">{item.label}</span>
                        <i className="bx bx-chevron-right ActiveIndicatorChevron"></i>
                    </NavLink>
                ))}
            </nav>

            {/* FOOTER SYSTEM STATUS CARD */}
            <div className="SidebarFooterCard">
                <div className="StatusPulseGroup">
                    <span className="LivePulseDot"></span>
                    <span className="StatusText">Grid Online</span>
                </div>
                <p>MNF Operational Server v2.4</p>
            </div>
        </aside>
    );
};

export default Sidebar;