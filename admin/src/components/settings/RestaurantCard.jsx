import React, { useRef } from "react";
import { API_URL } from "../../config/api";

const RestaurantCard = ({ settings, setSettings }) => {
    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value,
        });
    };

    const fileInputRef = useRef();

    const handleLogoChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSettings({
            ...settings,
            restaurantLogo: file,
            restaurantLogoPreview: URL.createObjectURL(file),
        });

    };

    return (
        <div className="SettingsCard FullWidthCard">
            <div className="SettingsCardHeader">
                <h2>
                    <i className="bx bx-store-alt HeaderIcon"></i>
                    Restaurant Profile & Identity
                </h2>
                <span className="CardSubtitle">General outlet details displayed on invoice and customer receipts</span>
            </div>

            <div className="SettingsGrid TwoColumns">

                <div className="InputGroup FullColumn">

                    <label>Restaurant Logo</label>

                    <div className="RestaurantLogoUploader">

                        <div className="RestaurantLogoPreview">

                            {settings.restaurantLogoPreview ? (

                                <img
                                    src={settings.restaurantLogoPreview}
                                    alt="Restaurant Logo"
                                />

                            ) : settings.restaurantLogo ? (

                                <img
                                    src={`${API_URL}${settings.restaurantLogo}`}
                                    alt="Restaurant Logo"
                                />

                            ) : (

                                <i className="bx bx-image-add"></i>

                            )}

                        </div>

                        <button
                            type="button"
                            className="UploadLogoBtn"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <i className="bx bx-upload"></i>

                            Upload Logo

                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                        />

                    </div>

                </div>
                <div className="InputGroup">
                    <label>Restaurant Title</label>
                    <input
                        name="restaurantName"
                        placeholder="e.g. MidNight Food Central"
                        value={settings.restaurantName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup">
                    <label>Support Phone Line</label>
                    <input
                        name="phone"
                        placeholder="e.g. +91 9876543210"
                        value={settings.phone || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup">
                    <label>Official Support Email</label>
                    <input
                        type="email"
                        name="supportEmail"
                        placeholder="support@midnightfood.com"
                        value={settings.supportEmail || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="InputGroup FullColumn">
                    <label>Physical Kitchen Address</label>
                    <textarea
                        name="address"
                        rows="3"
                        placeholder="Enter full physical address for store pickup and rider dispatching..."
                        value={settings.address || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;