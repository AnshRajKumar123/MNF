import React from "react";

const PaymentCard = ({ settings, setSettings }) => {
    const handleToggle = (field) => {
        setSettings({
            ...settings,
            payment: {
                ...settings.payment,
                [field]: !settings.payment[field],
            },
        });
    };

    return (
        <div className="SettingsCard">
            <div className="SettingsCardHeader">
                <h2>
                    <i className="bx bx-credit-card HeaderIcon"></i>
                    Payment Gateway Integration
                </h2>
                <span className="CardSubtitle">Enable or restrict payment methods at customer checkout</span>
            </div>

            <div className="ToggleGroupStack">
                <div className="ToggleRow" onClick={() => handleToggle("codEnabled")}>
                    <div className="ToggleLabelBlock">
                        <span className="ToggleTitle">Cash On Delivery (COD)</span>
                        <span className="ToggleDesc">Allow customers to pay cash upon rider delivery</span>
                    </div>

                    <div className={`CustomSwitchTrack ${settings.payment?.codEnabled ? "switch-active" : ""}`}>
                        <span className="SwitchThumb"></span>
                    </div>
                </div>

                <div className="ToggleRow" onClick={() => handleToggle("razorpayEnabled")}>
                    <div className="ToggleLabelBlock">
                        <span className="ToggleTitle">Razorpay Gateway (Online)</span>
                        <span className="ToggleDesc">Accept UPI, Credit/Debit Cards, and Net Banking</span>
                    </div>

                    <div className={`CustomSwitchTrack ${settings.payment?.razorpayEnabled ? "switch-active" : ""}`}>
                        <span className="SwitchThumb"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCard;