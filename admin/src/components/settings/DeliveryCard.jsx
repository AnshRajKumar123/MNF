import React from "react";

const DeliveryCard = ({ settings, setSettings }) => {
    const handleChange = (e) => {
        setSettings({
            ...settings,
            delivery: {
                ...settings.delivery,
                [e.target.name]: Number(e.target.value),
            },
        });
    };

    return (
        <div className="SettingsCard">
            <div className="SettingsCardHeader">
                <h2>
                    <i className="bx bxs-truck HeaderIcon"></i>
                    Delivery Rates & Logistics
                </h2>
                <span className="CardSubtitle">Configure fees, distance radius, and free delivery thresholds</span>
            </div>

            <div className="SettingsGrid TwoColumns">
                <div className="InputGroup">
                    <label>Base Delivery Charge (₹)</label>
                    <input
                        type="number"
                        name="baseCharge"
                        value={settings.delivery?.baseCharge ?? 0}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup">
                    <label>Free Delivery Minimum (₹)</label>
                    <input
                        type="number"
                        name="freeDeliveryAbove"
                        value={settings.delivery?.freeDeliveryAbove ?? 0}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup">
                    <label>Express Priority Surcharge (₹)</label>
                    <input
                        type="number"
                        name="expressCharge"
                        value={settings.delivery?.expressCharge ?? 0}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup">
                    <label>Max Delivery Radius (KM)</label>
                    <input
                        type="number"
                        name="maxDistance"
                        value={settings.delivery?.maxDistance ?? 0}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryCard;