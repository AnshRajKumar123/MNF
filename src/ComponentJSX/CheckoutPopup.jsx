import React, { useState, useEffect } from "react";
import "../ComponentCSS/CheckoutPopup.css";

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

    // Convert uploaded img to base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAddress({ ...newAddress, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    // Load addresses & merge with profile
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
                    image: profile.image || "/defaultUser.png"
                };

                saved.unshift(profileAddr);
                localStorage.setItem("MNF_UserAddresses", JSON.stringify(saved));
            }
        }

        setAddresses(saved);
        if (saved.length > 0) setSelectedAddress(saved[0]);
    }, []);

    // Remove Address
    const removeAddress = (id, e) => {
        e.stopPropagation();
        const updated = addresses.filter(a => a.id !== id);

        setAddresses(updated);
        localStorage.setItem("MNF_UserAddresses", JSON.stringify(updated));

        if (selectedAddress?.id === id) {
            setSelectedAddress(updated[0] || null);
        }
    };

    // Save new address
    const saveAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.pincode)
            return alert("Fill all required fields!");

        const updated = [...addresses, { id: Date.now(), ...newAddress }];
        localStorage.setItem("MNF_UserAddresses", JSON.stringify(updated));

        setAddresses(updated);
        setSelectedAddress(updated[updated.length - 1]);
        setAddNewMode(false);
    };

    // Continue to Payment
    const goToPayment = () => {
        if (!selectedAddress) return alert("Select an address!");

        localStorage.setItem("MNF_SelectedAddress", JSON.stringify(selectedAddress));
        setStep("payment");
    };

    // Final Pay
    const completePayment = () => {
        if (!selectedPayment) return alert("Choose a payment method!");

        // Generate order id
        const id = "MNF-" + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem("MNF_OrderID", id);
        setOrderId(id);

        // CART DETAILS
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;
        const tip = Number(localStorage.getItem("tip") || 0);
        const deliveryType = localStorage.getItem("deliveryType") || "standard";

        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percent / 100)) : 0;
        const shipping = subtotal >= 500 ? 0 : 40;
        const total = subtotal - discountAmount + shipping + tip;

        // SAVE ORDER
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

        // CLEAR CART AFTER ORDER
        localStorage.removeItem("cartItems");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("tip");
        localStorage.removeItem("instruction");
        localStorage.removeItem("deliveryType");

        setStep("success");
        setShowSuccess(true);
    };

    // ------------------------------------------
    // RENDER UI
    // ------------------------------------------
    return (
        <div className="checkout-overlay">
            <div className="checkout-popup">

                {/* STEP 1 — ADDRESS SCREEN */}
                {step === "address" && (
                    <>
                        <h2 className="popup-title">Delivery Address</h2>

                        {addresses.length > 0 && !addNewMode && (
                            <>
                                <div className="address-list">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className={`address-card ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                                            onClick={() => setSelectedAddress(addr)}
                                        >
                                            <button
                                                className="remove-address-btn"
                                                onClick={(e) => removeAddress(addr.id, e)}
                                            >
                                                ✕
                                            </button>

                                            <div className="addr-head">
                                                <img src={addr.image} className="addr-img" alt="" />
                                                <div>
                                                    <h4>{addr.name}</h4>
                                                    <p>{addr.building}</p>
                                                    <p className="small-text">{addr.address}</p>
                                                </div>
                                            </div>

                                            <p className="addr-extra">{addr.phone} · {addr.pincode}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="add-new" onClick={() => setAddNewMode(true)}>
                                    + Add New Address
                                </button>
                            </>
                        )}

                        {(addresses.length === 0 || addNewMode) && (
                            <div className="new-addr-form">

                                <label className="image-label">
                                    {newAddress.image ? (
                                        <img src={newAddress.image} className="preview-img" alt="" />
                                    ) : (
                                        <div className="placeholder-img">Upload Image</div>
                                    )}
                                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                </label>

                                <input placeholder="Your Name" value={newAddress.name}
                                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />

                                <input placeholder="Phone Number" value={newAddress.phone}
                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />

                                <input placeholder="House / Building" value={newAddress.building}
                                    onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })} />

                                <input placeholder="Address" value={newAddress.address}
                                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />

                                <input placeholder="Pincode" value={newAddress.pincode}
                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />

                                <button className="save-btn" onClick={saveAddress}>Save & Continue</button>
                            </div>
                        )}

                        <div className="popup-actions">
                            <button className="cancel-btn" onClick={closePopup}>Cancel</button>
                            {addresses.length > 0 && !addNewMode && (
                                <button className="proceed-btn" onClick={goToPayment}>
                                    Proceed to Payment
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* STEP 2 — PAYMENT SCREEN */}
                {step === "payment" && (
                    <div className="payment-section">

                        <div className="payment-header">
                            <button className="back-arrow" onClick={() => setStep("address")}>←</button>
                            <h2>Select Payment Method</h2>
                        </div>

                        {/* UPI */}
                        <div className="payment-group">
                            <label className="payment-title">
                                <input type="radio" checked={selectedPayment === "UPI"} onChange={() => setSelectedPayment("UPI")} />
                                UPI
                            </label>

                            {selectedPayment === "UPI" && (
                                <div className="payment-options">
                                    <button onClick={() => setSelectedPayment("Google Pay")}>Google Pay</button>
                                    <button onClick={() => setSelectedPayment("PhonePe")}>PhonePe</button>
                                    <button onClick={() => setSelectedPayment("Paytm")}>Paytm</button>
                                </div>
                            )}
                        </div>

                        {/* CARD */}
                        <div className="payment-group">
                            <label className="payment-title">
                                <input type="radio" checked={selectedPayment === "CARD"} onChange={() => setSelectedPayment("CARD")} />
                                Credit / Debit Card
                            </label>

                            {selectedPayment === "CARD" && (
                                <div className="payment-options">
                                    <input className="card-input" placeholder="Card Number" />
                                    <input className="card-input" placeholder="Expiry (MM/YY)" />
                                    <input className="card-input" placeholder="CVV" />
                                </div>
                            )}
                        </div>

                        {/* WALLETS */}
                        <div className="payment-group">
                            <label className="payment-title">
                                <input type="radio" checked={selectedPayment === "WALLET"} onChange={() => setSelectedPayment("WALLET")} />
                                Wallets
                            </label>

                            {selectedPayment === "WALLET" && (
                                <div className="payment-options">
                                    <button>Amazon Pay</button>
                                    <button>Mobikwik</button>
                                </div>
                            )}
                        </div>

                        {/* COD */}
                        <div className="payment-group">
                            <label className="payment-title">
                                <input type="radio" checked={selectedPayment === "COD"} onChange={() => setSelectedPayment("COD")} />
                                Cash On Delivery (COD)
                            </label>
                        </div>

                        <button className="pay-now-btn" onClick={completePayment}>
                            Pay Now
                        </button>
                    </div>
                )}

                {/* STEP 3 — SUCCESS SCREEN */}
                {step === "success" && showSuccess && (
                    <div className="order-success-overlay">
                        <div className="order-success-box">
                            <div className="success-icon">✔</div>

                            <h2 className="order-success-title">Order Successful</h2>
                            <p className="order-id-text">Order ID: <b>{orderId}</b></p>

                            <button className="track-btn" onClick={() => {
                                closePopup();
                                window.location.href = "/track-order";
                            }}>
                                Track Order
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckoutPopup;