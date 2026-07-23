const CouponFilters = ({
    search,
    setSearch,
    status,
    setStatus,
    onCreate,
}) => {

    return (

        <div className="CouponFilters">

            <div className="CouponSearchBox">

                <i className="bx bx-search"></i>

                <input
                    type="text"
                    placeholder="Search coupon code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="CouponStatusFilter"
            >

                <option value="all">
                    All Coupons
                </option>

                <option value="active">
                    Active
                </option>

                <option value="expired">
                    Expired
                </option>

                <option value="disabled">
                    Disabled
                </option>

            </select>

            <button
                className="CreateCouponButton"
                onClick={onCreate}
            >
                <i className="bx bx-plus"></i>

                Create Coupon
            </button>

        </div>

    );

};

export default CouponFilters;