import React, { useState, useEffect } from "react";
import "../ComponentCSS/CheckoutPopup.css";
import { ResturantIG, midnightCheckoutData, midnightOrderSuccessData } from "../assets/assest";

const CheckoutPopup = ({ closePopup }) => {
    const [step, setStep] = useState("address"); // "address" | "payment" | "success"

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addNewMode, setAddNewMode] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(
        localStorage.getItem("MNF_SelectedPayment") || ""
    );

    const [orderId, setOrderId] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        address: "",
        building: "",
        pincode: "",
        image: ""
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAddress({ ...newAddress, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("MNF_UserAddresses")) || [];
        const profile = JSON.parse(localStorage.getItem("MNF_UserProfile"));

        if (profile) {
            const exists = saved.some(a => a.phone === profile.phone);

            if (!exists) {
                const profileAddr = {
                    id: Date.now(),
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address,
                    building: profile.building,
                    pincode: profile.pincode,
                    image: profile.image || ""
                };

                saved.unshift(profileAddr);
                localStorage.setItem("MNF_UserAddresses", JSON.stringify(saved));
            }
        }

        setAddresses(saved);
        if (saved.length > 0) setSelectedAddress(saved[0]);
    }, []);

    const removeAddress = (id, e) => {
        e.stopPropagation();
        const updated = addresses.filter(a => a.id !== id);

        setAddresses(updated);
        localStorage.setItem("MNF_UserAddresses", JSON.stringify(updated));

        if (selectedAddress?.id === id) {
            setSelectedAddress(updated[0] || null);
        }
    };

    const saveAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.pincode)
            return alert("Fill all required fields!");

        const updated = [...addresses, { id: Date.now(), ...newAddress }];
        localStorage.setItem("MNF_UserAddresses", JSON.stringify(updated));

        setAddresses(updated);
        setSelectedAddress(updated[updated.length - 1]);
        setAddNewMode(false);
    };

    const goToPayment = () => {
        if (!selectedAddress) return alert("Select an address!");
        localStorage.setItem("MNF_SelectedAddress", JSON.stringify(selectedAddress));
        setStep("payment");
    };

    const completePayment = () => {
        if (!selectedPayment) return alert("Choose a payment method!");

        const id = "MNF-" + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem("MNF_OrderID", id);
        setOrderId(id);

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;
        const tip = Number(localStorage.getItem("tip") || 0);
        const deliveryType = localStorage.getItem("deliveryType") || "standard";

        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percent / 100)) : 0;
        const shipping = subtotal >= 500 ? 0 : 40;
        const total = subtotal - discountAmount + shipping + tip;

        const orderData = {
            id,
            items: cartItems,
            subtotal,
            discount: discountAmount,
            shipping,
            tip,
            total,
            deliveryType,
            payment: selectedPayment,
            address: JSON.parse(localStorage.getItem("MNF_SelectedAddress")),
            date: new Date().toLocaleString(),
            status: "On Process"
        };

        const existing = JSON.parse(localStorage.getItem("MNF_Orders")) || [];
        existing.unshift(orderData);
        localStorage.setItem("MNF_Orders", JSON.stringify(existing));

        localStorage.removeItem("cartItems");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("tip");
        localStorage.removeItem("instruction");
        localStorage.removeItem("deliveryType");

        setStep("success");
        setShowSuccess(true);
    };

    return (
        <div className="ProCheckoutOverlay">
            <div className="ProCheckoutPopupBentoCard">

                {/* STEP 1 — ADDRESS SELECTION / FORM SCREEN */}
                {step === "address" && (
                    <div className="ProCheckoutStepWrapper">
                        <h2 className="ProPopupTitleText">{midnightCheckoutData.titles.addressStep}</h2>

                        {addresses.length > 0 && !addNewMode && (
                            <>
                                <div className="ProAddressCardsGridTrack">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className={`ProAddressSlotCard ${selectedAddress?.id === addr.id ? "address-node-selected" : ""}`}
                                            onClick={() => setSelectedAddress(addr)}
                                        >
                                            <button className="ProAddressRemoveItemCTA" onClick={(e) => removeAddress(addr.id, e)}>
                                                <i className='bx bx-x'></i>
                                            </button>

                                            <div className="ProAddrHeadFlexGroup">
                                                <div className="ProAddrAvatarShield">
                                                    {addr.image ? (
                                                        <img src={addr.image} alt="" />
                                                    ) : (
                                                        <span className="AvatarFallbackLetter">{addr.name?.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="ProAddrTextCluster">
                                                    <h4>{addr.name}</h4>
                                                    <h5>{addr.building}</h5>
                                                    <p className="ProAddrTruncatedText">{addr.address}</p>
                                                </div>
                                            </div>
                                            <p className="ProAddrExtraFooterLine">{addr.phone} · {addr.pincode}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="ProAddNewAddressCTA" onClick={() => setAddNewMode(true)}>
                                    {midnightCheckoutData.actions.addNewAddress}
                                </button>
                            </>
                        )}

                        {(addresses.length === 0 || addNewMode) && (
                            <div className="ProNewAddrFormFieldsStack">
                                <label className="ProImageUploadContainerBox">
                                    {newAddress.image ? (
                                        <img src={newAddress.image} className="ProPreviewImageElement" alt="" />
                                    ) : (
                                        <div className="ProPlaceholderImgContent">
                                            <i className='bx bx-cloud-upload'></i>
                                            <span>{midnightCheckoutData.actions.uploadImg}</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                </label>

                                <div className="ProFormInputRowField"><input placeholder={midnightCheckoutData.placeholders.name} value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} /></div>
                                <div className="ProFormInputRowField"><input placeholder={midnightCheckoutData.placeholders.phone} value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} /></div>
                                <div className="ProFormInputRowField"><input placeholder={midnightCheckoutData.placeholders.building} value={newAddress.building} onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })} /></div>
                                <div className="ProFormInputRowField"><input placeholder={midnightCheckoutData.placeholders.address} value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} /></div>
                                <div className="ProFormInputRowField"><input placeholder={midnightCheckoutData.placeholders.pincode} value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} /></div>

                                <button className="ProSaveAddressSubmitCTA" onClick={saveAddress}>{midnightCheckoutData.actions.saveContinue}</button>
                            </div>
                        )}

                        <div className="ProPopupActionsRowDeck">
                            <button className="ProCancelDismissCTA" onClick={closePopup}>{midnightCheckoutData.actions.cancel}</button>
                            {addresses.length > 0 && !addNewMode && (
                                <button className="ProProceedNavigateCTA" onClick={goToPayment}>
                                    {midnightCheckoutData.actions.proceedPayment} <i className='bx bx-right-arrow-alt'></i>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2 — SETTLEMENT ROUTER SCREEN */}
                {step === "payment" && (
                    <div className="ProPaymentSectionContainer">
                        <div className="ProPaymentHeaderInlineRow">
                            <button className="ProPaymentBackArrowBtn" onClick={() => setStep("address")}>
                                <i className='bx bx-left-arrow-alt'></i>
                            </button>
                            <h2>{midnightCheckoutData.titles.paymentStep}</h2>
                        </div>

                        {/* UPI OPTION LAYER */}
                        <div className="ProPaymentMethodGroupBento">
                            <label className="ProPaymentGroupTitleLabel">
                                <input type="radio" checked={selectedPayment === "UPI" || selectedPayment === "Google Pay" || selectedPayment === "PhonePe" || selectedPayment === "Paytm"} onChange={() => setSelectedPayment("UPI")} />
                                {midnightCheckoutData.paymentMethods.upi}
                            </label>
                            {(selectedPayment === "UPI" || selectedPayment === "Google Pay" || selectedPayment === "PhonePe" || selectedPayment === "Paytm") && (
                                <div className="ProPaymentSubOptionsListStack">
                                    <button className={selectedPayment === "Google Pay" ? "sub-payment-node-active" : ""} onClick={() => setSelectedPayment("Google Pay")}><i className='bx bx-mobile-vibration'></i> Google Pay</button>
                                    <button className={selectedPayment === "PhonePe" ? "sub-payment-node-active" : ""} onClick={() => setSelectedPayment("PhonePe")}><i className='bx bx-wallet'></i> PhonePe</button>
                                    <button className={selectedPayment === "Paytm" ? "sub-payment-node-active" : ""} onClick={() => setSelectedPayment("Paytm")}><i className='bx bx-money'></i> Paytm</button>
                                </div>
                            )}
                        </div>

                        {/* CARD OPTION LAYER */}
                        <div className="ProPaymentMethodGroupBento">
                            <label className="ProPaymentGroupTitleLabel">
                                <input type="radio" checked={selectedPayment === "CARD"} onChange={() => setSelectedPayment("CARD")} />
                                {midnightCheckoutData.paymentMethods.card}
                            </label>
                            {selectedPayment === "CARD" && (
                                <div className="ProPaymentSubOptionsListStack CardInputsGroupModifier">
                                    <input className="ProCardInlineInputField" placeholder="Card Number Matrix Signature" />
                                    <div className="ProCardInputsFlexInlineRow">
                                        <input className="ProCardInlineInputField" placeholder="Expiry (MM/YY)" />
                                        <input className="ProCardInlineInputField" placeholder="CVV" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WALLETS OPTION LAYER */}
                        <div className="ProPaymentMethodGroupBento">
                            <label className="ProPaymentGroupTitleLabel">
                                <input type="radio" checked={selectedPayment === "WALLET"} onChange={() => setSelectedPayment("WALLET")} />
                                {midnightCheckoutData.paymentMethods.wallet}
                            </label>
                            {selectedPayment === "WALLET" && (
                                <div className="ProPaymentSubOptionsListStack">
                                    <button onClick={() => setSelectedPayment("Amazon Pay")}>Amazon Pay</button>
                                    <button onClick={() => setSelectedPayment("Mobikwik")}>Mobikwik</button>
                                </div>
                            )}
                        </div>

                        {/* COD OPTION LAYER */}
                        <div className="ProPaymentMethodGroupBento">
                            <label className="ProPaymentGroupTitleLabel">
                                <input type="radio" checked={selectedPayment === "COD"} onChange={() => setSelectedPayment("COD")} />
                                {midnightCheckoutData.paymentMethods.cod}
                            </label>
                        </div>

                        <button className="ProPayNowAuthorizationCTA" onClick={completePayment}>
                            {midnightCheckoutData.actions.payNow} <i className='bx bx-shield-quarter'></i>
                        </button>
                    </div>
                )}

                {/* STEP 3 — REDESIGNED INTEGRATED TRANSACTION SUCCESS MODAL */}
                {step === "success" && showSuccess && (
                    <div className="ProOrderSuccessPopupEmbeddedView">
                        <div className="ProOrderSuccessIconShield">
                            <div className="ProOrderPulseRing"></div>
                            <i className='bx bx-party'></i>
                        </div>

                        <span className="ProSystemLedgerTagText">{midnightOrderSuccessData.labels.title}</span>
                        <h2 className="ProOrderSuccessTitleText">{midnightOrderSuccessData.labels.subtitle}</h2>

                        <div className="ProOrderIdTelemetryBox">
                            <span>{midnightOrderSuccessData.labels.idPrefix}</span>
                            <strong>{orderId}</strong>
                        </div>

                        <button className="ProOrderTrackCTA" onClick={() => {
                            closePopup();
                            window.location.href = "/track-order";
                        }}>
                            {midnightOrderSuccessData.labels.trackBtn} <i className='bx bx-navigation'></i>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckoutPopup;