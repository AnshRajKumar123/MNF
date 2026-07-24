import { useEffect, useState } from "react";
import api from "../config/axios";
import { API_URL } from "../config/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { logoutAdmin, disableTwoFactor } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);

    const navigate = useNavigate();
    const { setAdmin } = useAuth();

    // 2FA State
    const [twoFactor, setTwoFactor] = useState({
        enabled: false,
        qrCode: "",
        secret: "",
        token: "",
    });
    const [loading2FA, setLoading2FA] = useState(false);

    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/admin/profile");
            setProfile(data.admin);

            setTwoFactor((prev) => ({
                ...prev,
                enabled: data.admin.twoFactorEnabled,
            }));

            setFormData({
                fullName: data.admin.fullName || "",
                phone: data.admin.phone || "",
                email: data.admin.email || "",
            });

            if (data.admin.image) {
                setPreview(`${API_URL}/${data.admin.image.replace(/^\/+/, "")}`);
            } else {
                setPreview("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load profile.");
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Form handlers
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("phone", formData.phone);
            if (image) {
                data.append("image", image);
            }

            await api.put("/admin/profile", data);
            toast.success("Profile updated successfully!");
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };

    // Password handlers
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const togglePassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password & confirm password do not match.");
            return;
        }

        try {
            const { data } = await api.put("/admin/profile/change-password", passwordData);
            toast.success(data.message || "Password updated successfully.");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Password change failed.");
        }
    };

    // 2FA Handlers
    const handleSetup2FA = async () => {
        try {
            setLoading2FA(true);
            const { data } = await api.post("/admin/profile/2fa/setup");
            setTwoFactor((prev) => ({
                ...prev,
                qrCode: data.qrCode,
                secret: data.secret,
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate QR code.");
        } finally {
            setLoading2FA(false);
        }
    };

    const handleVerify2FA = async () => {
        try {
            const { data } = await api.post("/admin/profile/2fa/verify", {
                token: twoFactor.token,
            });
            toast.success(data.message || "2FA Enabled Successfully!");
            setTwoFactor({
                enabled: true,
                qrCode: "",
                secret: "",
                token: "",
            });
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed.");
        }
    };

    const handleDisable2FA = async () => {
        const confirmDisable = window.confirm("Are you sure you want to disable Two-Factor Authentication?");
        if (!confirmDisable) return;

        try {
            const data = await disableTwoFactor();
            toast.success(data.message || "2FA Disabled.");
            setTwoFactor({
                enabled: false,
                qrCode: "",
                secret: "",
                token: "",
            });
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to disable 2FA.");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            setAdmin(null);
            toast.success("Logged out successfully.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed.");
        }
    };

    if (loadingProfile) {
        return (
            <div className="ProfileLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Retrieving Administrator Credentials...</h2>
            </div>
        );
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formData.fullName || "Admin"
    )}&background=6366f1&color=fff`;

    return (
        <div className="ProfilePage">
            {/* PAGE HEADER */}
            <div className="ProfileHeader">
                <div className="HeaderTitleGroup">
                    <h1>Admin Credentials & Security</h1>
                    <p>Manage personal credentials, authentication security keys, and access controls</p>
                </div>

                <button className="LogoutTopBtn" onClick={handleLogout}>
                    <i className="bx bx-log-out"></i> Logout Console
                </button>
            </div>

            <div className="ProfileContainer">
                {/* LEFT SIDE: AVATAR CARD & SYSTEM SUMMARY */}
                <div className="ProfileCard">
                    <div className="ProfileImageBox">
                        <img src={preview || defaultAvatar} alt="Profile Avatar" />
                        <label className="UploadButton">
                            <i className="bx bx-camera"></i> Change Photo
                            <input type="file" hidden accept="image/*" onChange={handleImage} />
                        </label>
                    </div>

                    <h2>{formData.fullName || "Administrator"}</h2>
                    <p className="ProfileEmailText">{formData.email}</p>

                    <div className="ProfileInfo">
                        <div className="InfoRow">
                            <span>Access Level</span>
                            <span className="RolePill">
                                <i className="bx bx-shield-alt-2"></i> Super Admin
                            </span>
                        </div>

                        <div className="InfoRow">
                            <span>Account Created</span>
                            <strong>
                                {profile?.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "N/A"}
                            </strong>
                        </div>

                        <div className="InfoRow">
                            <span>Node Key ID</span>
                            <strong className="MonoId">#{profile?._id?.slice(-8).toUpperCase()}</strong>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: PROFILE FORM & SECURITY CONTROLS */}
                <div className="ProfileRight">
                    {/* PERSONAL INFORMATION CARD */}
                    <form className="ProfileFormCard" onSubmit={handleSubmit}>
                        <div className="CardHeaderTitle">
                            <h3><i className="bx bx-user-circle"></i> Personal Information</h3>
                        </div>

                        <div className="FormGrid">
                            <div className="FormGroup">
                                <label>Full Name</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="FormGroup">
                                <label>Official Email (Read-Only)</label>
                                <input value={formData.email} readOnly className="ReadOnlyInput" />
                            </div>

                            <div className="FormGroup FullWidth">
                                <label>Phone Number Line</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>

                        <button type="submit" className="SaveButton">
                            <i className="bx bx-check-circle"></i> Save Profile Details
                        </button>
                    </form>

                    {/* SECURITY & AUTHENTICATION SETTINGS */}
                    <div className="SecuritySummaryCard">
                        <div className="CardHeaderTitle">
                            <h3><i className="bx bx-lock-alt"></i> Security & Access Credentials</h3>
                        </div>

                        <div className="SecurityActionRow">
                            <div className="SecurityTextGroup">
                                <h4>Account Security Passkey</h4>
                                <p>Ensure your account uses a strong random password to prevent unauthorized console access.</p>
                            </div>

                            <button
                                type="button"
                                className="OpenPasswordModalBtn"
                                onClick={() => setIsPasswordModalOpen(true)}
                            >
                                <i className="bx bx-key"></i> Change Password
                            </button>
                        </div>
                    </div>

                    {/* TWO-FACTOR AUTHENTICATION CARD */}
                    <div className="TwoFactorCard">
                        <div className="CardHeaderTitle">
                            <h3><i className="bx bx-qr-scan"></i> Two-Factor Authentication (2FA)</h3>
                        </div>

                        <p className="TwoFactorDesc">
                            Enhance login security using time-based OTP authenticators (Google Authenticator, Authy, or Microsoft Authenticator).
                        </p>

                        <div className="TwoFactorStatus">
                            <span>Authenticator Protection</span>
                            <span className={`StatusBadge ${twoFactor.enabled ? "Active" : "Inactive"}`}>
                                <span className="PulseDot"></span>
                                {twoFactor.enabled ? "Enabled & Active" : "Disabled"}
                            </span>
                        </div>

                        {!twoFactor.enabled && !twoFactor.qrCode && (
                            <button
                                className="Enable2FABtn"
                                onClick={handleSetup2FA}
                                type="button"
                                disabled={loading2FA}
                            >
                                <i className="bx bx-shield-quarter"></i>
                                {loading2FA ? "Generating QR Code..." : "Setup Two-Factor Authentication"}
                            </button>
                        )}

                        {twoFactor.qrCode && (
                            <div className="QRCodeBox">
                                <div className="QRFrame">
                                    <img src={twoFactor.qrCode} alt="2FA QR Code" />
                                </div>

                                <p className="InstructionText">
                                    1. Scan this QR code with your authenticator app.<br />
                                    2. Enter the generated 6-digit verification code below:
                                </p>

                                <div className="VerifySlot">
                                    <input
                                        className="VerifyInput"
                                        placeholder="000000"
                                        maxLength="6"
                                        value={twoFactor.token}
                                        onChange={(e) =>
                                            setTwoFactor({
                                                ...twoFactor,
                                                token: e.target.value,
                                            })
                                        }
                                    />
                                    <button className="SaveButton" type="button" onClick={handleVerify2FA}>
                                        Verify & Activate
                                    </button>
                                </div>
                            </div>
                        )}

                        {twoFactor.enabled && (
                            <button
                                type="button"
                                className="Disable2FAButton"
                                onClick={handleDisable2FA}
                            >
                                <i className="bx bx-block"></i> Disable Two-Factor Protection
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔒 CHANGE PASSWORD POPUP MODAL */}
            {isPasswordModalOpen && (
                <div className="PasswordModalOverlay" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="PasswordModal" onClick={(e) => e.stopPropagation()}>
                        <div className="ModalHeader">
                            <div className="HeaderTitleBlock">
                                <i className="bx bx-key HeaderIcon"></i>
                                <div>
                                    <h2>Change Admin Password</h2>
                                    <p>Enter your current password to authorize security updates</p>
                                </div>
                            </div>
                            <button className="CloseModalBtn" onClick={() => setIsPasswordModalOpen(false)}>
                                <i className="bx bx-x"></i>
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="PasswordModalForm">
                            <div className="FormGroup">
                                <label>Current Keypass</label>
                                <div className="PasswordInputWrapper">
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="PasswordToggle"
                                        onClick={() => togglePassword("current")}
                                    >
                                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="FormGroup">
                                <label>New Security Password</label>
                                <div className="PasswordInputWrapper">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="PasswordToggle"
                                        onClick={() => togglePassword("new")}
                                    >
                                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="FormGroup">
                                <label>Confirm New Password</label>
                                <div className="PasswordInputWrapper">
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="PasswordToggle"
                                        onClick={() => togglePassword("confirm")}
                                    >
                                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="ModalFooterActions">
                                <button
                                    type="button"
                                    className="CancelModalBtn"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="SaveButton">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;