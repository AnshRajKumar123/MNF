import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../services/settingsService";
import RestaurantCard from "../components/settings/RestaurantCard";
import DeliveryCard from "../components/settings/DeliveryCard";
import PaymentCard from "../components/settings/PaymentCard";
import NotificationCard from "../components/settings/NotificationCard";
import AppearanceCard from "../components/settings/AppearanceCard";
import "../styles/Settings.css";

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to load settings:", error);
                toast.error("Unable to load platform configuration.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {

        console.log("restaurantLogo:", settings.restaurantLogo);
        console.log("instanceof File:", settings.restaurantLogo instanceof File);

        try {
            setSaving(true);
            await updateSettings(settings);
            toast.success("Settings updated successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="SettingsLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Synchronizing System Configuration...</h2>
                <p>Retrieving operational parameters from backend database</p>
            </div>
        );
    }

    return (
        <div className="SettingsPage">
            {/* PAGE HEADER */}
            <div className="SettingsPageHeader">
                <div className="HeaderTitleGroup">
                    <h1>System Settings & Control</h1>
                    <p>Configure restaurant profile, delivery pricing rules, payment gateways, and system alerts</p>
                </div>
            </div>

            {/* BENTO GRID SETTINGS CONTAINER */}
            <div className="SettingsContainer">
                <RestaurantCard settings={settings} setSettings={setSettings} />
                <DeliveryCard settings={settings} setSettings={setSettings} />
                <PaymentCard settings={settings} setSettings={setSettings} />
                <NotificationCard settings={settings} setSettings={setSettings} />
                <AppearanceCard settings={settings} setSettings={setSettings} />
            </div>

            {/* FLOATING ACTION SAVE DOCK */}
            <div className="SettingsSaveDock">
                <div className="SaveDockInfo">
                    <i className="bx bx-info-circle"></i>
                    <span>Unsaved modifications will immediately affect live customer dispatches.</span>
                </div>
                <button className="SaveSettingsBtn" onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <i className="bx bx-loader-alt bx-spin"></i> Saving...
                        </>
                    ) : (
                        <>
                            <i className="bx bx-save"></i> Save Configuration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;