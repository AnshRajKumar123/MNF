import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic Breadcrumb Label Mapping
    const getPageTitle = (path) => {
        switch (path) {
            case "/dashboard": return { title: "Dashboard Overview", subtitle: "Real-time dispatch metrics & system analytics" };
            case "/products": return { title: "Menu Catalog Engine", subtitle: "Manage food items, pricing & categories" };
            case "/orders": return { title: "Live Orders Management", subtitle: "Process transactions & dispatch status" };
            case "/users": return { title: "User Access Directory", subtitle: "Manage accounts, permissions & customer history" };
            case "/coupons": return { title: "Coupons & Offers Matrix", subtitle: "Configure discount codes & promotions" };
            case "/settings": return { title: "System Settings", subtitle: "Configure server parameters & credentials" };
            default: return { title: "Admin Operations Console", subtitle: "Control center grid" };
        }
    };

    const currentMeta = getPageTitle(location.pathname);

    return (
        <header className="AdminNavbar">
            {/* LEFT: BREADCRUMB & MOBILE MENU TOGGLE */}
            <div className="NavLeftSection">
                <button className="MobileMenuTriggerBtn" onClick={onToggleSidebar}>
                    <i className="bx bx-menu"></i>
                </button>

                <div className="NavBreadcrumbHub">
                    <div className="BreadcrumbPill">
                        <i className="bx bx-shield-quarter"></i>
                        <span>Admin</span>
                        <i className="bx bx-chevron-right SeparatorIcon"></i>
                        <span className="ActivePage">{location.pathname.replace("/", "") || "dashboard"}</span>
                    </div>
                    <h2 className="NavHeaderTitle">{currentMeta.title}</h2>
                </div>
            </div>

            {/* RIGHT: SYSTEM CONTROLS & PROFILE */}
            <div className="NavRightControls">

                {/* SERVER TELEMETRY BADGE */}
                <div className="ServerTelemetryPill">
                    <span className="TelemetryPulse"></span>
                    <span className="TelemetryLabel">System Optimal</span>
                </div>

                {/* NOTIFICATIONS CTA */}
                <button className="NavActionIconBtn" title="Notifications">
                    <i className="bx bx-bell"></i>
                    <span className="NotificationGlowDot"></span>
                </button>

                {/* QUICK LOGS CTA */}
                <button className="NavActionIconBtn" title="System Audit Logs">
                    <i className="bx bx-terminal"></i>
                </button>

                <div className="NavDividerLine"></div>

                {/* PROFILE HUB */}
                <div className="AdminProfileHub">
                    <div className="AdminAvatarFrame">
                        <span className="AvatarInitial">A</span>
                        <span className="UserOnlineDot"></span>
                    </div>
                    <div className="AdminMetaText">
                        <span className="AdminName">Ansh (Admin)</span>
                        <span className="AdminRoleTag">Super Admin</span>
                    </div>
                    <i className="bx bx-chevron-down ProfileDropChevron"></i>
                </div>
            </div>
        </header>
    );
};

export default Navbar;