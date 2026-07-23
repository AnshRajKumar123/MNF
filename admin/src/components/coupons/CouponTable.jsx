const CouponTable = ({
    coupons,
    onEdit,
    onDelete,
    onToggle
}) => {

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

    if (!coupons.length) {

        return (
            <div className="CouponEmptyState">

                <i className="bx bx-coupon"></i>

                <h3>No Coupons Found</h3>

                <p>
                    Create your first coupon to start promotional campaigns.
                </p>

            </div>
        );

    }

    return (

        <div className="CouponTableWrapper">

            <table className="CouponTable">

                <thead>

                    <tr>

                        <th>Coupon</th>

                        <th>Discount</th>

                        <th>Minimum Order</th>

                        <th>Usage</th>

                        <th>Expires</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {coupons.map((coupon) => {

                        const status = getStatus(coupon);

                        return (

                            <tr key={coupon._id}>

                                <td>

                                    <div className="CouponCodeCell">

                                        <h4>{coupon.code}</h4>

                                        <span>
                                            {coupon.description || "No description"}
                                        </span>

                                    </div>

                                </td>

                                <td>

                                    {coupon.type === "percentage"
                                        ? `${coupon.value}%`
                                        : `₹${coupon.value}`}

                                </td>

                                <td>

                                    ₹{coupon.minOrder}

                                </td>

                                <td>

                                    {coupon.usedCount}

                                    {coupon.usageLimit > 0 &&
                                        ` / ${coupon.usageLimit}`}

                                </td>

                                <td>

                                    {new Date(
                                        coupon.expiresAt
                                    ).toLocaleDateString()}

                                </td>

                                <td>

                                    <span
                                        className={`CouponStatus ${status.className}`}
                                    >
                                        {status.text}
                                    </span>

                                </td>

                                <td>

                                    <div className="CouponActions">

                                        <button
                                            className="CouponActionBtn EditBtn"
                                            onClick={() => onEdit(coupon)}
                                        >
                                            <i className="bx bx-edit"></i>
                                        </button>

                                        <button
                                            className="CouponActionBtn ToggleBtn"
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