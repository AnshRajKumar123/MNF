import React, { useEffect, useState } from 'react';
import '../ComponentCSS/Cart.css';
import { ResturantIG, midnightCartData } from '../assets/assest';
import CheckoutPopup from "../ComponentJSX/CheckoutPopup";
import api from "../config/axios";
import { useSettings } from "../context/SettingsContext";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showFreePopup, setShowFreePopup] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const { settings } = useSettings();

    const deliveryOptions = {
        express: {
            label: "Express Transport",
            price: settings?.delivery?.expressCharge ?? 50,
            time: "15-20 mins"
        },
        standard: {
            label: "Standard Fleet",
            price: settings?.delivery?.baseCharge ?? 10,
            time: "20-25 mins"
        },
        economy: {
            label: "Eco Saver Link",
            price: 0,
            time: "25-30 mins"
        }
    };

    const [activeTab, setActiveTab] = useState("delivery");
    const [deliveryType, setDeliveryType] = useState(localStorage.getItem("deliveryType") || "standard");
    const [tip, setTip] = useState(Number(localStorage.getItem("tip")) || 0);
    const [customTip, setCustomTip] = useState("");
    const [instruction, setInstruction] = useState(localStorage.getItem("instruction") || "");

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

    const handleCustomTip = (val) => setCustomTip(val);

    const selectInstruction = (text) => {
        setInstruction(text);
        localStorage.setItem("instruction", text);
    };

    const FREE_SHIPPING_LIMIT =
        settings?.delivery?.freeDeliveryAbove ?? 500;

    const SHIPPING_COST =
        settings?.delivery?.baseCharge ?? 40;

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const res = await api.get("/cart");

                setCartItems(res.data.cart);

            } catch (error) {

                console.log(error);

            }

        };

        fetchCart();

    }, []);

    const updateQuantity = (index, delta) => {
        const updated = [...cartItems];
        const newQty = updated[index].quantity + delta;
        if (newQty <= 0) return;
        updated[index].quantity = newQty;
        setCartItems(updated);
        localStorage.setItem("cartItems", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeItem = async (cartId) => {
        try {

            await api.delete(`/cart/remove/${cartId}`);

            setCartItems(prev =>
                prev.filter(item => item._id !== cartId)
            );

            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {
            console.log(error);
        }
    };

    const handleApplyCoupon = async () => {

        try {

            if (!coupon.trim()) {

                return alert("Please enter a coupon code.");

            }

            const res = await api.post("/coupon/apply", {

                code: coupon,

                subtotal,

            });

            setAppliedCoupon(res.data.coupon);

            setCoupon("");

        } catch (error) {

            setAppliedCoupon(null);

            alert(
                error.response?.data?.message ||
                "Failed to apply coupon."
            );

        }

    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const shipping = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : SHIPPING_COST;
    const discountAmount = appliedCoupon
        ? appliedCoupon.discount
        : 0;
    const deliveryCharge = deliveryOptions[deliveryType].price;
    const finalTotal = subtotal - discountAmount + shipping + deliveryCharge + tip;

    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);
    const amountLeftForFree = Math.max(FREE_SHIPPING_LIMIT - subtotal, 0);

    useEffect(() => {
        if (subtotal >= 500 && cartItems.length > 0) {
            setShowFreePopup(true);
            setTimeout(() => setShowFreePopup(false), 2500);
        }
    }, [subtotal, cartItems.length]);


    useEffect(() => {

        setAppliedCoupon(null);

    }, [cartItems]);

    return (
        <div className="ProCartContainer">

            {/* LEFT COMPARTMENT: ITEMS PROFILE MATRIX */}
            <div className="ProCartLeftSection">
                <h1 className="ProCartTitle">{midnightCartData.labels.title}</h1>

                {cartItems.length === 0 ? (
                    <p className="ProCartEmptyText">{midnightCartData.labels.emptyText}</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="ProCartItemCard">
                            <div className="ProItemInfoCluster">
                                <div className="ProCartImageFrame">
                                    <img src={item.product.image} alt={item.name} />
                                </div>
                                <div className="ProItemTextMeta">
                                    <h2>{item.product.name}</h2>
                                    <p className="ProItemUnitRate">₹{item.product.price}</p>
                                </div>
                            </div>

                            {/* QUANTITY COUNTER NODE */}
                            <div className="ProCartQtyBox">
                                <button className="ProQtyActionBtn" onClick={() => updateQuantity(index, -1)}>
                                    <i className='bx bx-minus'></i>
                                </button>
                                <span className="ProQtyValueDisplay">{item.quantity}</span>
                                <button className="ProQtyActionBtn" onClick={() => updateQuantity(index, 1)}>
                                    <i className='bx bx-plus'></i>
                                </button>
                            </div>

                            {/* ITEM MATRIX TOTALS */}
                            <div className="ProCartSubtotalBox">
                                <p>₹{item.product.price * item.quantity}</p>
                            </div>

                            <button className="ProCartRemoveItemCTA" onClick={() => removeItem(item._id)}>
                                <i className='bx bx-trash'></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* RIGHT COMPARTMENT: CONTROLLER & TOTALS LEDGER */}
            <div className="ProCartRightSection">

                {/* MATRIX CONFIGURATOR BOX */}
                <div className="ProCartExtraBentoCard">
                    <div className="ProTabHeaderDeck">
                        {midnightCartData.tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`ProTabTriggerBtn ${activeTab === tab.id ? "active-tab-node" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="ProTabContentPanel">
                        {/* DELIVERY TAB ROUTER */}
                        {activeTab === "delivery" && (
                            <div className="ProDeliveryOptionsGrid">
                                {Object.keys(deliveryOptions).map(key => (
                                    <div
                                        key={key}
                                        className={`ProDeliveryOptionItem ${deliveryType === key ? "delivery-node-active" : ""} ${deliveryOptions[key].disabled ? "delivery-node-disabled" : ""}`}
                                        onClick={() => !deliveryOptions[key].disabled && selectDelivery(key)}
                                    >
                                        <div className="ProDeliveryLeftCluster">
                                            <input type="radio" checked={deliveryType === key} readOnly />
                                            <div className='ProDeliveryTextLine'>
                                                <p className="ProDeliveryLabelText">{deliveryOptions[key].label}</p>
                                                <span className="ProDeliveryTimeSpan">{deliveryOptions[key].time}</span>
                                            </div>
                                        </div>
                                        <p className="ProDeliveryChargeText">
                                            {deliveryOptions[key].price === 0 ? "Free" : `₹${deliveryOptions[key].price}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* RIDER GRATUITY TIP TAB ROUTER */}
                        {activeTab === "tip" && (
                            <div className="ProTipOptionsSuite">
                                <div className='ProTipBannerInline'>
                                    <p>Your late-night cravings deserve high-speed transit. Appreciate our delivery operators to keep the midnight dispatch system scaling efficiently.</p>
                                    <img src={ResturantIG.DeliveryPartner} alt="" />
                                </div>

                                <div className='ProTipSelectorChipsRow'>
                                    {[20, 30, 50].map(t => (
                                        <div
                                            key={t}
                                            className={`ProTipChipCard ${tip === t ? "tip-chip-active" : ""}`}
                                            onClick={() => selectTip(t)}
                                        >
                                            ₹{t}
                                        </div>
                                    ))}
                                </div>

                                <div className="ProCustomTipInputGroup">
                                    <input
                                        type="number"
                                        placeholder="Custom variable amount"
                                        value={customTip}
                                        onChange={(e) => handleCustomTip(e.target.value)}
                                    />
                                    <button onClick={() => selectTip(Number(customTip))}>Apply</button>
                                </div>
                            </div>
                        )}

                        {/* DISPATCH INSTRUCTIONS TAB ROUTER */}
                        {activeTab === "instruction" && (
                            <div className="ProInstructionOptionsGrid">
                                {instructionList.map((itm, idx) => (
                                    <div
                                        key={idx}
                                        className={`ProInstructionItemCard ${instruction === itm.title ? "instruction-node-active" : ""}`}
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

                {/* REDEEMABLE COUPON PANEL */}
                <div className="ProCartCouponBentoCard">
                    <h3>{midnightCartData.coupon.title}</h3>
                    <div className="ProCouponActionRow">
                        <input
                            type="text"
                            placeholder={midnightCartData.coupon.placeholder}
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                        <button onClick={handleApplyCoupon}>{midnightCartData.coupon.redeemBtn}</button>
                    </div>
                </div>

                {/* SETTLEMENT AUDIT FRAME SUMMARY */}
                <div className="ProCartSummaryBentoCard">
                    <h2>{midnightCartData.labels.summaryTitle}</h2>

                    <div className="ProSummaryRowItem">
                        <span>{midnightCartData.labels.subtotal}</span>
                        <strong>₹{subtotal}</strong>
                    </div>

                    {appliedCoupon && (
                        <div className="ProSummaryRowItem CouponDiscountHighlightRow">
                            {/* <span>Coupon "{appliedCoupon.code}"</span> */}

                            <span>
                                {appliedCoupon.code}
                                {" "}
                                (
                                {appliedCoupon.type === "percentage"
                                    ? `${appliedCoupon.value}%`
                                    : `₹${appliedCoupon.value}`}
                                )
                            </span>
                            <strong>-₹{discountAmount}</strong>
                        </div>
                    )}

                    <div className="ProSummaryRowItem">
                        <span>{midnightCartData.labels.shipping}</span>
                        <strong>{shipping === 0 ? "₹0" : `₹${shipping}`}</strong>
                    </div>

                    <div className="ProSummaryRowItem">
                        <span>{midnightCartData.labels.deliveryType}</span>
                        <strong>{deliveryOptions[deliveryType].price === 0 ? "₹0" : `₹${deliveryOptions[deliveryType].price}`}</strong>
                    </div>

                    {tip > 0 && (
                        <div className="ProSummaryRowItem">
                            <span>{midnightCartData.labels.tip}</span>
                            <strong>₹{tip}</strong>
                        </div>
                    )}

                    {/* TARGET SHIPPING THRESHOLD BAR */}
                    {cartItems.length > 0 && (
                        <div className="ProFreeDeliveryMetricsBox">
                            {shipping === 0 ? (
                                <p className="ProFreeDeliveryNotifyText SuccessColor">{midnightCartData.labels.freeDeliverySuccess}</p>
                            ) : (
                                <p className="ProFreeDeliveryNotifyText">{midnightCartData.labels.freeDeliveryProgress.replace("{amount}", amountLeftForFree)}</p>
                            )}
                            <div className="ProGlacialProgressBar">
                                <div className="ProGlacialFill" style={{ width: `${shippingProgress}%` }}></div>
                            </div>
                        </div>
                    )}

                    <div className="ProSummarySplitDividerLine"></div>

                    <div className="ProSummaryFinalTotalRow">
                        <span>{midnightCartData.labels.total}</span>
                        <span>₹{finalTotal}</span>
                    </div>

                    <button className="ProCheckoutAuthorizeCTA" onClick={() => setShowCheckout(true)}>
                        {midnightCartData.labels.checkoutBtn} <i className='bx bx-shield-quarter'></i>
                    </button>
                </div>

            </div>

            {showFreePopup && (
                <div className="ProGlacialToastOverlay">
                    <div className="ProGlacialToastBody">
                        <i className='bx bxs-party'></i> {midnightCartData.labels.freePopupText}
                    </div>
                </div>
            )}

            {showCheckout && (
                <CheckoutPopup
                    closePopup={() => setShowCheckout(false)}
                    appliedCoupon={appliedCoupon}
                    tip={tip}
                    deliveryType={deliveryType}
                    appliedCoupon={appliedCoupon}
                    finalTotal={finalTotal}
                    clearCartData={() => {
                        setAppliedCoupon(null);
                        setCoupon("");
                        setTip(0);
                        setCustomTip("");
                        setInstruction("");
                        setDeliveryType("standard");

                        localStorage.removeItem("tip");
                        localStorage.removeItem("instruction");
                        localStorage.removeItem("deliveryType");
                        localStorage.setItem("deliveryType", "standard");
                    }}
                />
            )}

        </div>
    );
};

export default Cart;