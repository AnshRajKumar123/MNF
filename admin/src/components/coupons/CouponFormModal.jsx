import { useEffect, useState } from "react";

const CouponFormModal = ({
    open,
    onClose,
    onSubmit,
    initialData = null,
}) => {

    const [formData, setFormData] = useState({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        expiresAt: "",
        description: "",
    });

    useEffect(() => {

        if (initialData) {

            setFormData({
                code: initialData.code || "",
                type: initialData.type || "percentage",
                value: initialData.value || "",
                minOrder: initialData.minOrder || "",
                maxDiscount: initialData.maxDiscount || "",
                usageLimit: initialData.usageLimit || "",
                expiresAt: initialData.expiresAt
                    ? initialData.expiresAt.slice(0, 10)
                    : "",
                description: initialData.description || "",
            });

        } else {

            setFormData({
                code: "",
                type: "percentage",
                value: "",
                minOrder: "",
                maxDiscount: "",
                usageLimit: "",
                expiresAt: "",
                description: "",
            });

        }

    }, [initialData, open]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    if (!open) return null;

    return (

        <div className="CouponModalOverlay">

            <div className="CouponModal">

                <div className="CouponModalHeader">

                    <h2>
                        {initialData
                            ? "Edit Coupon"
                            : "Create Coupon"}
                    </h2>

                    <button onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="CouponForm"
                >

                    <div className="CouponFormGrid">

                        <div>

                            <label>Coupon Code</label>

                            <input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div>

                            <label>Type</label>

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="percentage">
                                    Percentage
                                </option>

                                <option value="fixed">
                                    Fixed Amount
                                </option>

                            </select>

                        </div>

                        <div>

                            <label>Value</label>

                            <input
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div>

                            <label>Minimum Order</label>

                            <input
                                type="number"
                                name="minOrder"
                                value={formData.minOrder}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label>Maximum Discount</label>

                            <input
                                type="number"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label>Usage Limit</label>

                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label>Expiry Date</label>

                            <input
                                type="date"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div>

                        <label>Description</label>

                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="CouponModalFooter">

                        <button
                            type="button"
                            className="CancelBtn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="SaveBtn"
                        >
                            {initialData
                                ? "Update Coupon"
                                : "Create Coupon"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default CouponFormModal;