import React, { useEffect, useState } from 'react';
import '../ComponentCSS/Cart.css';
import { ResturantIG } from '../assets/assest';
import CheckoutPopup from "../ComponentJSX/CheckoutPopup";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showFreePopup, setShowFreePopup] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    const deliveryOptions = {
        express: { label: "Express", price: 19, time: "20-25 mins" },
        standard: { label: "Standard", price: 0, time: "30-35 mins" },
        eco: { label: "Eco Saver", price: 0, time: "Not available", disabled: true }
    };

    const [activeTab, setActiveTab] = useState("delivery");

    const [deliveryType, setDeliveryType] = useState(
        localStorage.getItem("deliveryType") || "standard"
    );

    const [tip, setTip] = useState(
        Number(localStorage.getItem("tip")) || 0
    );

    const [customTip, setCustomTip] = useState("");

    const [instruction, setInstruction] = useState(
        localStorage.getItem("instruction") || ""
    );

    const instructionList = [
        { title: "Directions to reach", icon: "bx-map" },
        { title: "Avoid calling", icon: "bx-phone-off" },
        { title: "Leave at the door", icon: "bx-door-open" },
        { title: "Avoid ringing bell", icon: "bx-bell" }
    ];

    const selectDelivery = (type) => {
        setDeliveryType(type);
        localStorage.setItem("deliveryType", type);
    };

    const selectTip = (amount) => {
        setTip(amount);
        localStorage.setItem("tip", amount);
    };

    const handleCustomTip = (val) => {
        setCustomTip(val);
    };

    const selectInstruction = (text) => {
        setInstruction(text);
        localStorage.setItem("instruction", text);
    };

    // PERCENTAGE COUPONS
    const couponsList = {
        "MIDNIGHT50": 50,
        "FOOD20": 20,
        "PIZZA10": 10
    };

    const FREE_SHIPPING_LIMIT = 500;
    const SHIPPING_COST = 40;

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(saved);

        const savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
        if (savedCoupon) setAppliedCoupon(savedCoupon);
    }, []);

    // UPDATE QUANTITY
    const updateQuantity = (index, delta) => {
        const updated = [...cartItems];
        const newQty = updated[index].quantity + delta;

        if (newQty <= 0) return;

        updated[index].quantity = newQty;
        setCartItems(updated);
        localStorage.setItem("cartItems", JSON.stringify(updated));

        window.dispatchEvent(new Event("cartUpdated"));
    };

    // REMOVE ITEM
    const removeItem = (index) => {
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
        localStorage.setItem('cartItems', JSON.stringify(updated));

        window.dispatchEvent(new Event("cartUpdated"));
    };

    // APPLY COUPON
    const handleApplyCoupon = () => {
        const code = coupon.trim().toUpperCase();

        if (couponsList[code]) {
            const couponObj = {
                title: code,
                percent: couponsList[code]
            };

            setAppliedCoupon(couponObj);
            localStorage.setItem("appliedCoupon", JSON.stringify(couponObj));

        } else {
            setAppliedCoupon(null);
            localStorage.removeItem("appliedCoupon");
            alert("Invalid coupon code");
        }
    };

    // SUBTOTAL
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : SHIPPING_COST;

    const discountAmount = appliedCoupon ?
        Math.round(subtotal * (appliedCoupon.percent / 100))
        : 0;

    const deliveryCharge = deliveryOptions[deliveryType].price;
    const finalTotal = subtotal - discountAmount + shipping + deliveryCharge + tip;


    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);
    const amountLeftForFree = Math.max(FREE_SHIPPING_LIMIT - subtotal, 0);


    // ⭐ ADD THIS useEffect RIGHT HERE ⭐
    useEffect(() => {
        if (subtotal >= 500 && cartItems.length > 0) {
            setShowFreePopup(true);

            setTimeout(() => {
                setShowFreePopup(false);
            }, 2500);
        }
    }, [subtotal]);

    return (
        <div className="cart-container">

            {/* LEFT SECTION */}
            <div className="cart-left">
                <h1 className="cart-title">Your Cart</h1>

                {cartItems.length === 0 ? (
                    <p className="empty-text">Your cart is empty.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <div className="item-info">
                                <img src={item.image} alt={item.name} className="item-img" />
                                <div>
                                    <h2 className="item-name">{item.name}</h2>
                                    <p className="item-price">₹{item.price}</p>
                                </div>
                            </div>

                            {/* QUANTITY */}
                            <div className="qty-box">
                                <button className="qty-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                                <span className="qty-value">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                            </div>

                            {/* SUBTOTAL */}
                            <div className="subtotal-box">
                                <p className="subtotal">₹{item.price * item.quantity}</p>
                            </div>

                            <button className="remove-btn" onClick={() => removeItem(index)}>✕</button>
                        </div>
                    ))
                )}
            </div>

            {/* RIGHT SECTION */}
            <div className="cart-right">

                {/* DELIVERY / TIP / INSTRUCTION TABS */}
                <div className="cart-extra-box">

                    {/* Tabs Navigation */}
                    <div className="tab-header">
                        <button
                            className={`tab-btn ${activeTab === "delivery" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("delivery")}
                        >
                            Delivery Type
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "tip" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("tip")}
                        >
                            Tip
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "instruction" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("instruction")}
                        >
                            Instruction
                        </button>
                    </div>

                    {/* TAB CONTENT BOX */}
                    <div className="tab-content">

                        {/* DELIVERY TAB */}
                        {activeTab === "delivery" && (
                            <div className="delivery-options">
                                {Object.keys(deliveryOptions).map(key => (
                                    <div
                                        key={key}
                                        className={`delivery-item ${deliveryType === key ? "del-active" : ""} ${deliveryOptions[key].disabled ? "del-disabled" : ""}`}
                                        onClick={() => !deliveryOptions[key].disabled && selectDelivery(key)}
                                    >
                                        <div className="delivery-left">
                                            <input
                                                type="radio"
                                                checked={deliveryType === key}
                                                readOnly
                                            />
                                            <div className='OnOneLine'>
                                                <p className="delivery-label">{deliveryOptions[key].label}</p>
                                                <p>{deliveryOptions[key].time}</p>
                                            </div>
                                        </div>

                                        <p className="delivery-charge">
                                            {deliveryOptions[key].price === 0 ? "Free" : `₹${deliveryOptions[key].price}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TIP TAB */}
                        {activeTab === "tip" && (
                            <div className="tip-options">

                                <div className='OnOneLine3'>
                                    <p>Your <b>Late-night cravings</b> deserve fast delivery, and our riders make it happen. Show your appreciation with a <b>Tip</b> and keep the <b>Midnight magic</b> alive.</p>
                                    <img src={ResturantIG.DeliveryPartner} />
                                </div>

                                <div className='OneOneLine2'>
                                    {[20, 30, 50].map(t => (
                                        <div
                                            key={t}
                                            className={`tip-item ${tip === t ? "tip-active" : ""}`}
                                            onClick={() => selectTip(t)}
                                        >
                                            Tip ₹{t}
                                        </div>
                                    ))}
                                </div>

                                {/* CUSTOM TIP */}
                                <div className="tip-item custom-tip">
                                    <input
                                        type="number"
                                        placeholder="Enter tip amount"
                                        value={customTip}
                                        onChange={(e) => handleCustomTip(e.target.value)}
                                    />
                                    <button onClick={() => selectTip(Number(customTip))}>Apply</button>
                                </div>
                            </div>
                        )}

                        {/* INSTRUCTIONS TAB */}
                        {activeTab === "instruction" && (
                            <div className="instruction-options">
                                {instructionList.map((itm, idx) => (
                                    <div
                                        key={idx}
                                        className={`instruction-item ${instruction === itm.title ? "inst-active" : ""}`}
                                        onClick={() => selectInstruction(itm.title)}
                                    >
                                        <i className={`bx ${itm.icon}`}></i>
                                        <p>{itm.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* COUPON BOX */}
                <div className="cart-coupon-box">
                    <h3 className="coupon-title">Apply Coupon</h3>

                    <div className="CouPonBox">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="coupon-input"
                        />

                        <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                            Redeem
                        </button>
                    </div>
                </div>

                {/* CART SUMMARY */}
                <div className="cart-summary">
                    <h2 className="summary-title">Cart Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    {appliedCoupon && (
                        <div className="summary-row coupon-applied">
                            <span>{appliedCoupon.title} ({appliedCoupon.percent}% OFF)</span>
                            <span className="discount-text">-₹{discountAmount}</span>
                        </div>
                    )}

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "₹0" : `₹${shipping}`}</span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery Type</span>
                        <span>{deliveryOptions[deliveryType].price === 0 ? "₹0" : `₹${deliveryOptions[deliveryType].price}`}</span>
                    </div>

                    {/* Tip */}
                    {tip > 0 && (
                        <div className="summary-row">
                            <span>Tip</span>
                            <span>₹{tip}</span>
                        </div>
                    )}

                    {/* PROGRESS TO FREE DELIVERY */}
                    {cartItems.length > 0 && (
                        <div className="free-delivery-box">
                            {shipping === 0 ? (
                                <p className="free-text">Congratulations! You got FREE Delivery 🎉</p>
                            ) : (
                                <p className="free-text">Add ₹{amountLeftForFree} more for FREE Delivery</p>
                            )}

                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${shippingProgress}%` }}></div>
                            </div>
                        </div>
                    )}

                    <hr className="divider" />

                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{finalTotal}</span>
                    </div>

                    <button className="checkout-btn" onClick={() => setShowCheckout(true)}>Checkout</button>
                </div>

            </div>

            {showFreePopup && (
                <div className="free-popup">
                    🎉 Free Delivery Unlocked!
                    <br />
                    You saved ₹40 on shipping.
                </div>
            )}

            {showCheckout && (
                <CheckoutPopup closePopup={() => setShowCheckout(false)} />
            )}

        </div>
    );
};

export default Cart;