import { useEffect, useState, useRef } from "react";

const CouponFormModal = ({ open, onClose, onSubmit, initialData = null }) => {
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

    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const typeDropdownRef = useRef(null);

    const typeOptions = [
        { value: "percentage", label: "Percentage (%)", icon: "bx bx-percentage" },
        { value: "fixed", label: "Fixed Amount (₹)", icon: "bx bx-purchase-tag-alt" },
    ];

    // Close discount type dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
                setIsTypeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code || "",
                type: initialData.type || "percentage",
                value: initialData.value || "",
                minOrder: initialData.minOrder || "",
                maxDiscount: initialData.maxDiscount || "",
                usageLimit: initialData.usageLimit || "",
                expiresAt: initialData.expiresAt ? initialData.expiresAt.slice(0, 10) : "",
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

    if (!open) return null;

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

    const selectedType = typeOptions.find((opt) => opt.value === formData.type) || typeOptions[0];

    return (
        <div className="CouponModalOverlay" onClick={onClose}>
            <div className="CouponModal" onClick={(e) => e.stopPropagation()}>
                <div className="CouponModalHeader">
                    <div className="HeaderLabelGroup">
                        <i className="bx bx-purchase-tag-alt HeaderIcon"></i>
                        <h2>{initialData ? "Configure Coupon Parameters" : "Launch New Campaign Code"}</h2>
                    </div>

                    <button className="CloseModalBtn" onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="CouponForm">
                    <div className="CouponFormGrid">
                        {/* Coupon Code */}
                        <div className="FormFieldSlot">
                            <label>Coupon Code</label>
                            <input
                                name="code"
                                placeholder="e.g. MIDNIGHT50"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 🎛️ CUSTOM DISCOUNT TYPE DROPDOWN */}
                        <div className="FormFieldSlot">
                            <label>Discount Type</label>
                            <div className="CustomModalDropdown" ref={typeDropdownRef}>
                                <button
                                    type="button"
                                    className="ModalDropdownTrigger"
                                    onClick={() => setIsTypeOpen((prev) => !prev)}
                                >
                                    <span className="TriggerValue">
                                        <i className={selectedType.icon}></i>
                                        <span>{selectedType.label}</span>
                                    </span>
                                    <i className={`bx bx-chevron-down DropChevron ${isTypeOpen ? "rotate" : ""}`}></i>
                                </button>

                                {isTypeOpen && (
                                    <ul className="ModalDropdownMenu">
                                        {typeOptions.map((opt) => (
                                            <li
                                                key={opt.value}
                                                className={`ModalOptionItem ${opt.value === formData.type ? "selected" : ""}`}
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, type: opt.value }));
                                                    setIsTypeOpen(false);
                                                }}
                                            >
                                                <i className={opt.icon}></i>
                                                <span>{opt.label}</span>
                                                {opt.value === formData.type && <i className="bx bx-check CheckIcon"></i>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Value */}
                        <div className="FormFieldSlot">
                            <label>Discount Value</label>
                            <input
                                type="number"
                                name="value"
                                placeholder="e.g. 20 or 150"
                                value={formData.value}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Min Order */}
                        <div className="FormFieldSlot">
                            <label>Minimum Order (₹)</label>
                            <input
                                type="number"
                                name="minOrder"
                                placeholder="e.g. 499"
                                value={formData.minOrder}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Max Discount */}
                        <div className="FormFieldSlot">
                            <label>Maximum Discount (₹)</label>
                            <input
                                type="number"
                                name="maxDiscount"
                                placeholder="e.g. 200"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Usage Limit */}
                        <div className="FormFieldSlot">
                            <label>Usage Limit</label>
                            <input
                                type="number"
                                name="usageLimit"
                                placeholder="e.g. 100 (Leave blank for unlimited)"
                                value={formData.usageLimit}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Expiry Date */}
                        <div className="FormFieldSlot FullColumn">
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

                    {/* Description */}
                    <div className="FormFieldSlot">
                        <label>Campaign Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="Describe promotion terms and target audience..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Footer CTAs */}
                    <div className="CouponModalFooter">
                        <button type="button" className="CancelBtn" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit" className="SaveBtn">
                            {initialData ? "Update Campaign" : "Publish Coupon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponFormModal;