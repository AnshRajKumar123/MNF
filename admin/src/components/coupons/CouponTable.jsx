import React from "react";

const CouponTable = ({ coupons, onEdit, onDelete, onToggle }) => {
    const getStatus = (coupon) => {
        if (!coupon.active) {
            return {
                text: "Disabled",
                className: "CouponDisabled",
            };
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return {
                text: "Expired",
                className: "CouponExpired",
            };
        }

        return {
            text: "Active",
            className: "CouponActive",
        };
    };

    if (!coupons || !coupons.length) {
        return (
            <div className="CouponEmptyState">
                <i className="bx bx-purchase-tag-alt"></i>
                <h3>No Campaign Codes Found</h3>
                <p>Create your first discount coupon to launch promotional offers.</p>
            </div>
        );
    }

    return (
        <div className="CouponTableWrapper">
            <table className="CouponTable">
                <thead>
                    <tr>
                        <th>Promo Code</th>
                        <th>Discount</th>
                        <th>Min Order</th>
                        <th>Usage Limit</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th className="TextRight">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {coupons.map((coupon) => {
                        const status = getStatus(coupon);

                        return (
                            <tr key={coupon._id}>
                                <td>
                                    <div className="CouponCodeCell">
                                        <span className="PromoCodeBadge">
                                            <i className="bx bx-purchase-tag"></i> {coupon.code}
                                        </span>
                                        <span className="CouponDescText">
                                            {coupon.description || "No description provided"}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <span className="DiscountValueTag">
                                        {coupon.type === "percentage"
                                            ? `${coupon.value}% OFF`
                                            : `₹${coupon.value} OFF`}
                                    </span>
                                </td>

                                <td>
                                    <span className="MinOrderTag">₹{coupon.minOrder || 0}</span>
                                </td>

                                <td>
                                    <span className="UsagePill">
                                        {coupon.usedCount || 0}
                                        {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : " (Unlimited)"}
                                    </span>
                                </td>

                                <td>
                                    <span className="DateText">
                                        {new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </td>

                                <td>
                                    <span className={`CouponStatus ${status.className}`}>
                                        <span className="StatusPulseDot"></span>
                                        {status.text}
                                    </span>
                                </td>

                                <td className="TextRight">
                                    <div className="CouponActions">
                                        <button
                                            className="CouponActionBtn EditBtn"
                                            onClick={() => onEdit(coupon)}
                                            title="Edit Coupon"
                                        >
                                            <i className="bx bx-edit-alt"></i>
                                        </button>

                                        <button
                                            className={`CouponActionBtn ToggleBtn ${coupon.active ? "active-toggle" : ""}`}
                                            onClick={() => onToggle(coupon)}
                                            title={coupon.active ? "Disable Coupon" : "Enable Coupon"}
                                        >
                                            <i
                                                className={
                                                    coupon.active
                                                        ? "bx bx-toggle-right"
                                                        : "bx bx-toggle-left"
                                                }
                                            ></i>
                                        </button>

                                        <button
                                            className="CouponActionBtn DeleteBtn"
                                            onClick={() => onDelete(coupon)}
                                            title="Delete Coupon"
                                        >
                                            <i className="bx bx-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CouponTable;