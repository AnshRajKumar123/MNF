import React from "react";
import { API_URL } from "../../config/api";

const BannerCard = ({ banner, onEdit, onDelete }) => {
    return (
        <div className="BannerCard">
            {/* BANNER MEDIA CONTAINER */}
            <div className="BannerImageWrapper">
                <img
                    src={`${API_URL}${banner.image}`}
                    alt={banner.title}
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/600x300?text=Banner+Graphic+Missing";
                    }}
                />
                
                {/* PRIORITY CHIP */}
                <div className="BannerOverlayBadge PriorityBadge">
                    <i className="bx bx-layer"></i> Priority #{banner.priority || 0}
                </div>

                {/* STATUS BADGE OVERLAY */}
                <div className="BannerOverlayBadge StatusBadgeSlot">
                    {banner.active ? (
                        <span className="ActiveBadge">
                            <span className="PulseDot"></span> Active
                        </span>
                    ) : (
                        <span className="InactiveBadge">
                            <span className="PulseDot"></span> Inactive
                        </span>
                    )}
                </div>
            </div>

            {/* CONTENT BODY */}
            <div className="BannerContent">
                <h3>{banner.title || "Untitled Banner"}</h3>
                <p>{banner.subtitle || "No subtitle provided for this campaign."}</p>

                {/* CTA DETAILS */}
                <div className="BannerMetaDeck">
                    {banner.buttonText && (
                        <span className="CtaTag">
                            <i className="bx bx-pointer"></i> {banner.buttonText} → {banner.buttonLink || "#"}
                        </span>
                    )}
                    {banner.startDate && (
                        <span className="DateTag">
                            <i className="bx bx-calendar"></i> {new Date(banner.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {banner.endDate ? new Date(banner.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Indefinite"}
                        </span>
                    )}
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="BannerActions">
                <button className="EditBtn" onClick={() => onEdit(banner)}>
                    <i className="bx bx-edit-alt"></i> Edit
                </button>

                <button className="DeleteBtn" onClick={() => onDelete(banner._id)}>
                    <i className="bx bx-trash"></i> Delete
                </button>
            </div>
        </div>
    );
};

export default BannerCard;