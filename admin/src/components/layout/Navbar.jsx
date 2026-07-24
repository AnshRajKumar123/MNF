import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/api";
import "../../styles/Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const { admin } = useAuth(); // Retrieve live logged-in admin data

    // Dynamic Breadcrumb Label Mapping
    const getPageTitle = (path) => {
        switch (path) {
            case "/dashboard": return { title: "Dashboard Overview", subtitle: "Real-time dispatch metrics & system analytics" };
            case "/products": return { title: "Menu Catalog Engine", subtitle: "Manage food items, pricing & categories" };
            case "/orders": return { title: "Live Orders Management", subtitle: "Process transactions & dispatch status" };
            case "/users": return { title: "User Access Directory", subtitle: "Manage accounts, permissions & customer history" };
            case "/coupons": return { title: "Coupons & Offers Matrix", subtitle: "Configure discount codes & promotions" };
            case "/banners": return { title: "Banner Management", subtitle: "Configure homepage sliders & promo campaigns" };
            case "/settings": return { title: "System Settings", subtitle: "Configure server parameters & credentials" };
            case "/profile": return { title: "Admin Credentials", subtitle: "Manage admin account & security keys" };
            default: return { title: "Admin Operations Console", subtitle: "Control center grid" };
        }
    };

    const currentMeta = getPageTitle(location.pathname);

    // Format admin image URL safely
    const adminLogoUrl = admin?.image
        ? `${API_URL}/${admin.image.replace(/^\/+/, "")}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            admin?.fullName || "Admin"
        )}&background=6366f1&color=fff`;

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

            {/* RIGHT: SYSTEM CONTROLS & DYNAMIC PROFILE HUB */}
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

                {/* PROFILE HUB WITH DYNAMIC LOGO & NAME */}
                <NavLink to="/profile" className="AdminProfileHub">
                    <div className="AdminAvatarFrame">
                        <img
                            src={adminLogoUrl}
                            alt={admin?.fullName || "Admin Logo"}
                            className="AdminLogoImg"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    admin?.fullName || "Admin"
                                )}&background=6366f1&color=fff`;
                            }}
                        />
                        <span className="UserOnlineDot"></span>
                    </div>

                    <div className="AdminMetaText">
                        <span className="AdminName">{admin?.fullName || "Administrator"}</span>
                        <span className="AdminRoleTag">
                            {admin?.isAdmin ? "Super Admin" : "Console Admin"}
                        </span>
                    </div>

                    <i className="bx bx-chevron-down ProfileDropChevron"></i>
                </NavLink>
            </div>
        </header>
    );
};

export default Navbar;