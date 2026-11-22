import React from "react";

const NotificationCard = ({ settings, setSettings }) => {
    const toggle = (field) => {
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                [field]: !settings.notifications[field],
            },
        });
    };

    return (
        <div className="SettingsCard">
            <div className="SettingsCardHeader">
                <h2>
                    <i className="bx bx-bell HeaderIcon"></i>
                    System Telemetry & Alerts
                </h2>
                <span className="CardSubtitle">Configure automated admin notifications and trigger events</span>
            </div>

            <div className="ToggleGroupStack">
                <div className="ToggleRow" onClick={() => toggle("newOrder")}>
                    <div className="ToggleLabelBlock">
                        <span className="ToggleTitle">New Dispatch Alerts</span>
                        <span className="ToggleDesc">Audible chime & popup when a customer places an order</span>
                    </div>

                    <div className={`CustomSwitchTrack ${settings.notifications?.newOrder ? "switch-active" : ""}`}>
                        <span className="SwitchThumb"></span>
                    </div>
                </div>

                <div className="ToggleRow" onClick={() => toggle("lowStock")}>
                    <div className="ToggleLabelBlock">
                        <span className="ToggleTitle">Low Inventory Warnings</span>
                        <span className="ToggleDesc">Notify when ingredients or menu items are low</span>
                    </div>

                    <div className={`CustomSwitchTrack ${settings.notifications?.lowStock ? "switch-active" : ""}`}>
                        <span className="SwitchThumb"></span>
                    </div>
                </div>

                <div className="ToggleRow" onClick={() => toggle("newUser")}>
                    <div className="ToggleLabelBlock">
                        <span className="ToggleTitle">Customer Registration Alerts</span>
                        <span className="ToggleDesc">Notify on new user account creations</span>
                    </div>

                    <div className={`CustomSwitchTrack ${settings.notifications?.newUser ? "switch-active" : ""}`}>
                        <span className="SwitchThumb"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;