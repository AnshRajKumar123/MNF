import React from "react";

const AppearanceCard = ({ settings, setSettings }) => {
    return (
        <div className="SettingsCard">
            <div className="SettingsCardHeader">
                <h2>
                    <i className="bx bx-palette HeaderIcon"></i>
                    Console Theme Customization
                </h2>
                <span className="CardSubtitle">Adjust brand accent color system tokens</span>
            </div>

            <div className="AppearancePickerRow">
                <div className="ColorPreviewUnit">
                    <div
                        className="ColorSwatchShield"
                        style={{ backgroundColor: settings.appearance?.primaryColor || "#6366f1" }}
                    ></div>
                    <div className="ColorMeta">
                        <span className="ColorLabel">Primary Accent Token</span>
                        <strong className="HexCode">{settings.appearance?.primaryColor || "#6366f1"}</strong>
                    </div>
                </div>

                <div className="InputGroup ColorInputSlot">
                    <label>Select Hex Accent</label>
                    <input
                        type="color"
                        value={settings.appearance?.primaryColor || "#6366f1"}
                        onChange={(e) => {
                            setSettings({
                                ...settings,
                                appearance: {
                                    ...settings.appearance,
                                    primaryColor: e.target.value,
                                },
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppearanceCard;