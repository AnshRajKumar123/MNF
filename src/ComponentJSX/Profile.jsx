import React, { useEffect, useState } from "react";
import "../ComponentCSS/Profile.css";
import AnotherNav from "../PagesJSX/AnotherNav";
import Toast from "../ComponentJSX/Toast";
import { midnightProfileData } from "../assets/assest";

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
    });

    const [toastMessage, setToastMessage] = useState("");
    const [changed, setChanged] = useState(false);
    const [shakeField, setShakeField] = useState("");
    const [glow, setGlow] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("MNF_UserProfile");
        if (saved) setProfile(JSON.parse(saved));
    }, []);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const updated = { ...profile, image: reader.result };
            setProfile(updated);
            localStorage.setItem("MNF_UserProfile", JSON.stringify(updated));
            window.dispatchEvent(new Event("profileUpdated"));
            showToast("Profile Image Updated!");
        };
        reader.readAsDataURL(file);
        setChanged(true);
    };

    const removeImage = () => {
        const updated = { ...profile, image: "" };
        setProfile(updated);
        localStorage.setItem("MNF_UserProfile", JSON.stringify(updated));
        window.dispatchEvent(new Event("profileUpdated"));
        showToast("Profile Image Removed!");
        setChanged(true);
    };

    const validate = () => {
        if (!profile.name.trim()) {
            setShakeField("name");
            showToast("Name cannot be empty!");
            return false;
        }
        if (profile.phone.length < 10) {
            setShakeField("phone");
            showToast("Phone number must be 10 digits!");
            return false;
        }
        if (!/^\S+@\S+\.\S+/.test(profile.email)) {
            setShakeField("email");
            showToast("Enter a valid email address!");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validate()) return;

        localStorage.setItem("MNF_UserProfile", JSON.stringify(profile));
        window.dispatchEvent(new Event("profileUpdated"));
        showToast("Profile Updated Successfully!");
        setChanged(false);

        setGlow(true);
        setTimeout(() => setGlow(false), 1000);
        setShakeField("");
    };

    return (
        <>
            <AnotherNav />

            {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}

            <section className="ProUserProfileContainer">

                {/* ---------- LEFT COMPARTMENT: AVATAR DISPLAY CONTROL CARD ---------- */}
                <div className="ProUserAvatarCard">
                    <div className="ProUserLogoBadge">
                        {profile.image ? (
                            <img src={profile.image} alt="User Profile Avatar" />
                        ) : (
                            <span>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : midnightProfileData.labels.fallbackLetter}
                            </span>
                        )}
                    </div>

                    <h1 className="ProUserNameTitle">{profile.name || midnightProfileData.labels.fallbackName}</h1>

                    <label className="ProUploadImageCTA">
                        {midnightProfileData.labels.uploadBtn}
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </label>

                    {profile.image && (
                        <button onClick={removeImage} className="ProPurgeImageBtn">
                            {midnightProfileData.labels.removeBtn}
                        </button>
                    )}
                </div>

                {/* ---------- RIGHT COMPARTMENT: USER DATA LEDGER FORM ---------- */}
                <div className={`ProUserDetailsFormBlock ${glow ? "ProSuccessGlowPulse" : ""}`}>

                    <div className="ProLabelInputGroup">
                        <label className="ProInputFormLabel">{midnightProfileData.labels.nameLabel}</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className={shakeField === "name" ? "ProFieldShakeAnimation" : ""}
                            value={profile.name}
                            onChange={(e) => {
                                setProfile((prev) => ({ ...prev, name: e.target.value }));
                                setChanged(true);
                            }}
                            onBlur={(e) => {
                                const formatted = formatName(e.target.value);
                                setProfile((prev) => ({ ...prev, name: formatted }));
                            }}
                        />
                    </div>

                    <div className="ProLabelInputGroup">
                        <label className="ProInputFormLabel">{midnightProfileData.labels.phoneLabel}</label>
                        <div className="ProPhoneFlexRow">
                            <select
                                className="ProCountrySelectBox"
                                value={profile.country || "IN"}
                                onChange={(e) => {
                                    const selected = midnightProfileData.countries.find((c) => c.code === e.target.value);
                                    setProfile((prev) => ({
                                        ...prev,
                                        country: selected.code,
                                        dial: selected.dial,
                                    }));
                                    setChanged(true);
                                }}
                            >
                                {midnightProfileData.countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.code} ({c.dial})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                className={shakeField === "phone" ? "ProFieldShakeAnimation" : ""}
                                placeholder="Phone Number"
                                value={profile.phone}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, "");
                                    if (val.length > 10) val = val.slice(0, 10);
                                    setProfile((prev) => ({ ...prev, phone: val }));
                                    setChanged(true);
                                }}
                            />
                        </div>
                        {profile.phone && (
                            <p className="ProFormattedPhoneLabelText">
                                {profile.dial || "+91"} {profile.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                            </p>
                        )}
                    </div>

                    <div className="ProLabelInputGroup">
                        <label className="ProInputFormLabel">{midnightProfileData.labels.emailLabel}</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className={shakeField === "email" ? "ProFieldShakeAnimation" : ""}
                            value={profile.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="ProLabelInputGridRow">
                        <div className="ProLabelInputGroup">
                            <label className="ProInputFormLabel">{midnightProfileData.labels.buildingLabel}</label>
                            <input
                                type="text"
                                name="building"
                                placeholder="Building / House Name"
                                value={profile.building}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="ProLabelInputGroup">
                            <label className="ProInputFormLabel">{midnightProfileData.labels.pincodeLabel}</label>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pin Code"
                                value={profile.pincode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="ProLabelInputGroup">
                        <label className="ProInputFormLabel">{midnightProfileData.labels.addressLabel}</label>
                        <textarea
                            name="address"
                            placeholder="Provide your complete logistical address layout..."
                            value={profile.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="ProLabelInputGroup">
                        <label className="ProInputFormLabel">{midnightProfileData.labels.genderLabel}</label>
                        <div className="ProGenderSelectTrackContainer">
                            {midnightProfileData.genderOptions.map((opt) => (
                                <div
                                    key={opt.label}
                                    className={`ProGenderOptionItemCard ${profile.gender === opt.label ? "GenderNodeActive" : ""}`}
                                    onClick={() => {
                                        setProfile((prev) => ({ ...prev, gender: opt.label }));
                                        setChanged(true);
                                    }}
                                >
                                    <span className="ProGenderEmojiSpan">{opt.icon}</span>
                                    <span className="ProGenderTextSpan">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className={`ProSaveProfileCTA ${changed ? "" : "ProBtnStateDisabled"}`}
                        onClick={handleSave}
                        disabled={!changed}
                    >
                        {midnightProfileData.labels.saveBtn} <i className='bx bx-check-shield'></i>
                    </button>
                </div>
            </section>
        </>
    );
};

export default Profile;