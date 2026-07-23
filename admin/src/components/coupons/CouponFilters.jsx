import React, { useState, useRef, useEffect } from "react";

const CouponFilters = ({
    search,
    setSearch,
    status,
    setStatus,
    onCreate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: "all", label: "All Statuses", icon: "⚡" },
        { value: "active", label: "Active", icon: "🟢" },
        { value: "expired", label: "Expired", icon: "🟡" },
        { value: "disabled", label: "Disabled", icon: "🔴" },
    ];

    // Close custom dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === status) || options[0];

    return (
        <div className="CouponFilters">
            {/* Search Box */}
            <div className="CouponSearchBox">
                <i className="bx bx-search"></i>
                <input
                    type="text"
                    placeholder="Search promo codes or terms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="FilterActionsGroup">
                {/* 🎛️ CUSTOM STATUS FILTER DROPDOWN */}
                <div className="CustomFilterDropdown" ref={dropdownRef}>
                    <button
                        type="button"
                        className="FilterDropdownTrigger"
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        <span className="TriggerLabel">
                            <span>{selectedOption.icon}</span>
                            <span>{selectedOption.label}</span>
                        </span>
                        <i className={`bx bx-chevron-down DropChevron ${isOpen ? "rotate" : ""}`}></i>
                    </button>

                    {isOpen && (
                        <ul className="FilterDropdownMenu">
                            {options.map((opt) => (
                                <li
                                    key={opt.value}
                                    className={`FilterOptionItem ${opt.value === status ? "selected" : ""}`}
                                    onClick={() => {
                                        setStatus(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span>{opt.icon}</span>
                                    <span>{opt.label}</span>
                                    {opt.value === status && <i className="bx bx-check CheckIcon"></i>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Create CTA */}
                <button className="CreateCouponButton" onClick={onCreate}>
                    <i className="bx bx-plus"></i>
                    <span>Create Campaign</span>
                </button>
            </div>
        </div>
    );
};

export default CouponFilters;