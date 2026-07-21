import React, { useState, useEffect } from "react";
import "../ComponentCSS/CheckoutPopup.css";
import { ResturantIG, midnightCheckoutData, midnightOrderSuccessData } from "../assets/assest";
import api from "../config/axios";
import { API_URL } from "../config/api";

const CheckoutPopup = ({ closePopup, appliedCoupon, deliveryType, tip, finalTotal, clearCartData }) => {
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

        const fetchProfile = async () => {

            try {

                const { data } = await api.get("/auth/profile");

                const profileAddress = {
                    id: "profile",
                    name: data.user.fullName,
                    phone: data.user.phone || "",
                    building: data.user.building || "",
                    address: data.user.address || "",
                    pincode: data.user.pincode || "",
                    image: data.user.image || "",
                };

                setAddresses([profileAddress]);
                setSelectedAddress(profileAddress);

            } catch (error) {
                console.log(error);
            }

        };

        fetchProfile();

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

    const saveAddress = async () => {

        if (
            !newAddress.name ||
            !newAddress.phone ||
            !newAddress.address ||
            !newAddress.pincode
        ) {
            return alert("Fill all required fields!");
        }

        try {

            await api.put("/auth/profile", {
                phone: newAddress.phone,
                building: newAddress.building,
                address: newAddress.address,
                pincode: newAddress.pincode,
                image: newAddress.image,
            });

            const profileAddress = {
                id: "profile",
                ...newAddress,
            };

            setAddresses([profileAddress]);
            setSelectedAddress(profileAddress);
            setAddNewMode(false);

        } catch (error) {
            console.log(error);
        }

    };

    const goToDelivery = () => {

        if (!selectedAddress) {
            return alert("Select an address!");
        }

        setStep("payment");

    };

    const goToPayment = () => {

        if (!deliveryType) {
            return alert("Select a delivery type!");
        }

        setStep("payment");

    };

    const completePayment = async () => {

        if (!selectedPayment) {
            return alert("Choose a payment method!");
        }

        try {

            // Cash On Delivery
            if (selectedPayment === "COD") {

                const { data } = await api.post("/order/place", {
                    address: selectedAddress,
                    paymentMethod: selectedPayment,
                    deliveryType,
                    coupon: appliedCoupon,
                    tip,
                });

                clearCartData();
                window.dispatchEvent(new Event("cartUpdated"));

                setOrderId(data.order._id);
                setStep("success");
                setShowSuccess(true);

                return;
            }

            // Online Payment
            await openRazorpay();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to place order."
            );
        }

    };

    const openRazorpay = async () => {

        try {

            const { data } = await api.post(
                "/payment/create-order",
                {
                    amount: finalTotal
                }
            );

            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: data.order.amount,

                currency: data.order.currency,

                name: "MidNight Food",

                description: "Food Order",

                order_id: data.order.id,

                handler: async function (response) {

                    try {

                        // 1. Verify payment

                        const verify = await api.post("/payment/verify", {

                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,

                        });

                        if (!verify.data.success) {

                            return alert("Payment verification failed.");

                        }

                        // 2. Create order

                        const { data } = await api.post("/order/place", {

                            address: selectedAddress,
                            paymentMethod: selectedPayment,
                            deliveryType,
                            coupon: appliedCoupon,
                            tip,

                            paymentStatus: "Paid"

                        });

                        // 3. Clear cart

                        clearCartData();

                        window.dispatchEvent(
                            new Event("cartUpdated")
                        );

                        // 4. Show success popup

                        setOrderId(data.order._id);

                        setStep("success");

                        setShowSuccess(true);

                    }

                    catch (error) {

                        console.log(error);

                        alert("Payment completed but order creation failed.");

                    }

                },

                theme: {
                    color: "#ff6b35",
                },

            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.log(error);

        }

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
                                                        <img
                                                            src={addr.image ? `${API_URL}${addr.image}` : ""}
                                                            alt={addr.name}
                                                        />
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
                                <button className="ProProceedNavigateCTA" onClick={goToDelivery}>
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
                            <button
                                className="ProPaymentBackArrowBtn"
                                onClick={() => setStep("delivery")}
                            >
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
                            <strong>
                                #{orderId.slice(-6).toUpperCase()}
                            </strong>
                        </div>

                        <button
                            className="ProOrderTrackCTA"
                            onClick={() => {
                                closePopup();
                                window.location.href = `/track-order/${orderId}`;
                            }}
                        >
                            {midnightOrderSuccessData.labels.trackBtn} <i className='bx bx-navigation'></i>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckoutPopup;