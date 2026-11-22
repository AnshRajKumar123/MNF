import React, { useEffect, useState } from "react";
import "../ComponentCSS/Profile.css";
import AnotherNav from "../PagesJSX/AnotherNav";
import Toast from "../ComponentJSX/Toast";
import { midnightProfileData } from "../assets/assest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { getImageUrl } from "../utils/getImageUrl";

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        phone: "",
        email: "",
        building: "",
        address: "",
        pincode: "",
        gender: "",
        image: "",
        country: "IN",
        dial: "+91",
    });

    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState("");
    const [changed, setChanged] = useState(false);
    const [shakeField, setShakeField] = useState("");
    const [glow, setGlow] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/auth/profile`, {
                    withCredentials: true,
                });
                const user = response.data.user;
                setProfile({
                    name: user.fullName || "",
                    phone: user.phone || "",
                    email: user.email || "",
                    building: user.building || "",
                    address: user.address || "",
                    pincode: user.pincode || "",
                    gender: user.gender || "",
                    image: user.image || "",
                    country: user.country || "IN",
                    dial: user.dial || "+91",
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem("mnfUserLoggedIn");
            navigate("/SignInUp");
        } catch (error) {
            console.error(error);
        }
    };

    const showToast = (msg) => setToastMessage(msg);
    const closeToast = () => setToastMessage("");

    const formatName = (name) =>
        name
            .trim()
            .split(/\s+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formatted = value;
        if (name === "name") formatted = formatName(value);

        setProfile((prev) => ({
            ...prev,
            [name]: formatted,
        }));
        setChanged(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post(
                `${API_URL}/auth/upload-profile-image`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setProfile((prev) => ({
                ...prev,
                image: response.data.user.image,
            }));

            window.dispatchEvent(new Event("profileUpdated"));
            showToast(response.data.message || "Avatar updated!");
            setChanged(true);
        } catch (error) {
            showToast(error.response?.data?.message || "Image upload failed.");
        }
    };

    const removeImage = async () => {
        try {
            const response = await axios.delete(
                `${API_URL}/auth/remove-profile-image`,
                { withCredentials: true }
            );

            setProfile((prev) => ({
                ...prev,
                image: "",
            }));

            window.dispatchEvent(new Event("profileUpdated"));
            showToast(response.data.message || "Avatar removed");
            setChanged(true);
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to remove image.");
        }
    };

    const validate = () => {
        if (profile.phone && profile.phone.length < 10) {
            setShakeField("phone");
            showToast("Phone number must be at least 10 digits!");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);

        try {
            const response = await axios.put(
                `${API_URL}/auth/profile`,
                {
                    phone: profile.phone,
                    country: profile.country,
                    dial: profile.dial,
                    building: profile.building,
                    address: profile.address,
                    pincode: profile.pincode,
                    gender: profile.gender,
                    image: profile.image,
                },
                { withCredentials: true }
            );

            showToast(response.data.message || "Profile updated successfully!");
            window.dispatchEvent(new Event("profileUpdated"));
            setChanged(false);
            setGlow(true);
            setTimeout(() => setGlow(false), 1200);
            setShakeField("");
        } catch (error) {
            showToast(error.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const profileImage = getImageUrl(profile.image);

    return (
        <>
            <AnotherNav />
            {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}

            <div className="ProProfilePageWrapper">
                <main className="ProUserProfileContainer">

                    {/* Left Account Card */}
                    <aside className="ProUserAvatarCard">
                        <div className="AvatarImageWrap">
                            <div className="ProUserLogoBadge">
                                {profile.image ? (
                                    <img src={profileImage} alt="User Avatar" />
                                ) : (
                                    <span>
                                        {profile.name
                                            ? profile.name.charAt(0).toUpperCase()
                                            : midnightProfileData?.labels?.fallbackLetter || "U"}
                                    </span>
                                )}
                            </div>
                            <label className="FloatingUploadBadge" title="Upload new photo">
                                <i className="bx bx-camera"></i>
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                            </label>
                        </div>

                        <h2 className="ProUserNameTitle">
                            {profile.name || midnightProfileData?.labels?.fallbackName || "User"}
                        </h2>
                        <span className="UserEmailSubtitle">{profile.email}</span>

                        <div className="AvatarActionsCluster">
                            <label className="ProUploadImageCTA">
                                <i className="bx bx-cloud-upload"></i>
                                <span>{midnightProfileData?.labels?.uploadBtn || "Change Photo"}</span>
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                            </label>

                            {profile.image && (
                                <button type="button" onClick={removeImage} className="ProPurgeImageBtn">
                                    <i className="bx bx-trash"></i>
                                    <span>{midnightProfileData?.labels?.removeBtn || "Remove Photo"}</span>
                                </button>
                            )}
                        </div>

                        <div className="CardSeparator"></div>

                        <button type="button" className="ProLogoutBtn" onClick={handleLogout}>
                            <i className="bx bx-log-out-circle"></i>
                            <span>Sign Out</span>
                        </button>
                    </aside>

                    {/* Right Form Ledger */}
                    <section className={`ProUserDetailsFormBlock ${glow ? "ProSuccessGlowPulse" : ""}`}>
                        <div className="FormSectionTitleBar">
                            <div>
                                <h3>Account Information</h3>
                                <p>Manage your identity and midnight dispatch coordinates</p>
                            </div>
                            <span className="VerifiedTag">
                                <i className="bx bxs-badge-check"></i> Active Member
                            </span>
                        </div>

                        {/* Read-only Identity Section */}
                        <div className="FormSubsection">
                            <span className="SubsectionLabel">Account Verification</span>
                            <div className="ProLabelInputGridRow">
                                <div className="ProLabelInputGroup">
                                    <label className="ProInputFormLabel">Authorized Full Name</label>
                                    <div className="InputWithIcon ProReadOnlyWrapper">
                                        <i className="bx bx-user input-glyph"></i>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            readOnly
                                            className="ProReadOnlyField"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div className="ProLabelInputGroup">
                                    <label className="ProInputFormLabel">Primary Email</label>
                                    <div className="InputWithIcon ProReadOnlyWrapper">
                                        <i className="bx bx-envelope input-glyph"></i>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className="ProReadOnlyField"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Logistics */}
                        <div className="FormSubsection">
                            <span className="SubsectionLabel">Delivery Coordinates</span>

                            <div className="ProLabelInputGroup">
                                <label className="ProInputFormLabel">Mobile Contact</label>
                                <div className="ProPhoneFlexRow">
                                    <select
                                        className="ProCountrySelectBox"
                                        value={profile.country || "IN"}
                                        onChange={(e) => {
                                            const selected = midnightProfileData?.countries?.find(
                                                (c) => c.code === e.target.value
                                            );
                                            setProfile((prev) => ({
                                                ...prev,
                                                country: selected ? selected.code : "IN",
                                                dial: selected ? selected.dial : "+91",
                                            }));
                                            setChanged(true);
                                        }}
                                    >
                                        {midnightProfileData?.countries?.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.flag} {c.code} ({c.dial})
                                            </option>
                                        ))}
                                    </select>

                                    <div className="InputWithIcon PhoneInputFlex">
                                        <i className="bx bx-phone input-glyph"></i>
                                        <input
                                            type="text"
                                            className={shakeField === "phone" ? "ProFieldShakeAnimation" : ""}
                                            placeholder="Enter phone number"
                                            value={profile.phone}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, "");
                                                if (val.length > 10) val = val.slice(0, 10);
                                                setProfile((prev) => ({ ...prev, phone: val }));
                                                setChanged(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                {profile.phone && (
                                    <p className="ProFormattedPhoneLabelText">
                                        Verified format: {profile.dial || "+91"} {profile.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                                    </p>
                                )}
                            </div>

                            <div className="ProLabelInputGridRow">
                                <div className="ProLabelInputGroup">
                                    <label className="ProInputFormLabel">Flat / House / Suite</label>
                                    <div className="InputWithIcon">
                                        <i className="bx bx-buildings input-glyph"></i>
                                        <input
                                            type="text"
                                            name="building"
                                            placeholder="e.g. Apartment 402, Block B"
                                            value={profile.building}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="ProLabelInputGroup">
                                    <label className="ProInputFormLabel">Postal Code</label>
                                    <div className="InputWithIcon">
                                        <i className="bx bx-map-pin input-glyph"></i>
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="e.g. 110001"
                                            value={profile.pincode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="ProLabelInputGroup">
                                <label className="ProInputFormLabel">Full Street Address</label>
                                <textarea
                                    name="address"
                                    placeholder="Enter street, landmark, and delivery instructions..."
                                    value={profile.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Gender selection */}
                        <div className="FormSubsection">
                            <label className="ProInputFormLabel">Identity Gender (Optional)</label>
                            <div className="ProGenderSelectTrackContainer">
                                {midnightProfileData?.genderOptions?.map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.label}
                                        className={`ProGenderOptionItemCard ${profile.gender === opt.label ? "GenderNodeActive" : ""
                                            }`}
                                        onClick={() => {
                                            setProfile((prev) => ({ ...prev, gender: opt.label }));
                                            setChanged(true);
                                        }}
                                    >
                                        <span className="ProGenderEmojiSpan">{opt.icon}</span>
                                        <span className="ProGenderTextSpan">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Save Trigger */}
                        <div className="FormActionsFooter">
                            <button
                                type="button"
                                className={`ProSaveProfileCTA ${!changed || saving ? "ProBtnStateDisabled" : ""}`}
                                onClick={handleSave}
                                disabled={!changed || saving}
                            >
                                <i className={`bx ${saving ? "bx-loader-alt bx-spin" : "bx-check-circle"}`}></i>
                                <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
                            </button>
                        </div>
                    </section>

                </main>
            </div>
        </>
    );
};

export default Profile;