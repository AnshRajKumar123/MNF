import React, { useEffect, useState } from "react";
import "../ComponentCSS/Profile.css";
import AnotherNav from "../PagesJSX/AnotherNav";
import Toast from "../ComponentJSX/Toast";

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
    const [changed, setChanged] = useState(false); // Enable/Disable Save button
    const [shakeField, setShakeField] = useState(""); // Field to shake
    const [glow, setGlow] = useState(false); // Success Glow

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("MNF_UserProfile");
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    const showToast = (msg) => setToastMessage(msg);
    const closeToast = () => setToastMessage("");

    // --- Auto Capitalize Name ---
    const formatName = (name) =>
        name
            .trim()
            .split(/\s+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

    // Handle input change
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

    // -------- Handle Image Upload --------
    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         const updated = { ...profile, image: reader.result };
    //         setProfile(updated);
    //         localStorage.setItem("MNF_UserProfile", JSON.stringify(updated));

    //         window.dispatchEvent(new Event("profileUpdated")); // notify navbar

    //         showToast("Profile Image Updated!");
    //     };
    //     reader.readAsDataURL(file);

    //     setChanged(true);
    // };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const updated = { ...profile, image: reader.result };
            setProfile(updated);
            localStorage.setItem("MNF_UserProfile", JSON.stringify(updated));

            window.dispatchEvent(new Event("profileUpdated")); // notify navbar

            showToast("Profile Image Updated!");
        };
        reader.readAsDataURL(file);

        setChanged(true);
    };

    // -------- Remove Image --------
    const removeImage = () => {
        const updated = { ...profile, image: "" };
        setProfile(updated);
        localStorage.setItem("MNF_UserProfile", JSON.stringify(updated));
        window.dispatchEvent(new Event("profileUpdated")); // notify navbar
        showToast("Profile Image Removed!");
        setChanged(true);
    };

    // -------- Validation --------
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

        if (!/^\S+@\S+\.\S+$/.test(profile.email)) {
            setShakeField("email");
            showToast("Enter a valid email address!");
            return false;
        }

        return true;
    };

    // -------- Save --------
    const handleSave = () => {
        if (!validate()) return;

        localStorage.setItem("MNF_UserProfile", JSON.stringify(profile));

        // 🔥 Notify Navbar about update
        window.dispatchEvent(new Event("profileUpdated"));

        showToast("Profile Updated Successfully!");
        setChanged(false);

        setGlow(true);
        setTimeout(() => setGlow(false), 1000);

        setShakeField("");
    };

    const countries = [
        { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
        { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
        { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
        { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
        { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
    ];

    return (
        <>
            <AnotherNav />

            {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}

            <section className="UserProfile">
                {/* ---------- Profile Image Section ---------- */}
                <div className="UserImageLogo">
                    <div className="UserLogo">
                        {profile.image ? (
                            <img src={profile.image} alt="User" />
                        ) : (
                            <span>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                            </span>
                        )}
                    </div>

                    <h1 className="UserName">{profile.name || "Your Name Here"}</h1>

                    <label className="UpdatedProButton">
                        Upload Profile Image
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </label>

                    {profile.image && (
                        <button onClick={removeImage} className="RemoveImageBtn">
                            Remove Image
                        </button>
                    )}
                </div>

                {/* ---------- User Details Form ---------- */}
                <div className={`UserDetails ${glow ? "SuccessGlow" : ""}`}>
                    <div className="LabelInput">
                        <label className="InputLabelBox">Name :</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className={shakeField === "name" ? "ShakeField" : ""}
                            value={profile.name}
                            onChange={(e) => {
                                // allow spaces freely
                                setProfile((prev) => ({ ...prev, name: e.target.value }));
                                setChanged(true);
                            }}
                            onBlur={(e) => {
                                // format only when leaving the input
                                const formatted = formatName(e.target.value);
                                setProfile((prev) => ({ ...prev, name: formatted }));
                            }}
                        />
                    </div>

                    <div className="LabelInput">
                        <label className="InputLabelBox">Phone No. :</label>

                        <div className="PhoneFlex">
                            <select
                                className="CountrySelect"
                                value={profile.country || "IN"}
                                onChange={(e) => {
                                    const selected = countries.find((c) => c.code === e.target.value);
                                    setProfile((prev) => ({
                                        ...prev,
                                        country: selected.code,
                                        dial: selected.dial,
                                    }));
                                    setChanged(true);
                                }}
                            >
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.name} ({c.dial})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                className={shakeField === "phone" ? "ShakeField" : ""}
                                placeholder="Phone Number"
                                value={profile.phone}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, ""); // remove non-numbers
                                    if (val.length > 10) val = val.slice(0, 10);
                                    setProfile((prev) => ({ ...prev, phone: val }));
                                    setChanged(true);
                                }}
                            />
                        </div>

                        {/* Auto formatted full phone */}
                        {profile.phone && (
                            <p className="FormattedPhone">
                                {profile.dial || "+91"} {profile.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                            </p>
                        )}
                    </div>

                    <div className="LabelInput">
                        <label className="InputLabelBox">Email Address :</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className={shakeField === "email" ? "ShakeField" : ""}
                            value={profile.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="LabelInput">
                        <label className="InputLabelBox">Building / House Name :</label>
                        <input
                            type="text"
                            name="building"
                            placeholder="Building / House Name"
                            value={profile.building}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="LabelInput">
                        <label className="InputLabelBox">Personal Address :</label>
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={profile.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="LabelInput">
                        <label className="InputLabelBox">Pin Code :</label>
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pin Code"
                            value={profile.pincode}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Gender */}
                    <div className="LabelInput">
                        <label className="InputLabelBox">Gender :</label>

                        <div className="GenderSelectContainer">
                            {[
                                { label: "Male", icon: "👨" },
                                { label: "Female", icon: "👩" },
                                { label: "Other", icon: "🌈" },
                            ].map((opt) => (
                                <div
                                    key={opt.label}
                                    className={`GenderOptionCard ${profile.gender === opt.label ? "GenderActive" : ""
                                        }`}
                                    onClick={() => {
                                        setProfile((prev) => ({ ...prev, gender: opt.label }));
                                        setChanged(true);
                                    }}
                                >
                                    <span className="GenderEmoji">{opt.icon}</span>
                                    <span className="GenderText">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className={`UpdatedProButton ${changed ? "" : "DisabledBtn"}`}
                        onClick={handleSave}
                        disabled={!changed}
                    >
                        Save Profile
                    </button>
                </div>
            </section>
        </>
    );
};

export default Profile;