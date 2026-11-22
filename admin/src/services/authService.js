import api from "../config/axios";

// ============================
// Admin Login & Session
// ============================
export const loginAdmin = async (loginData) => {
    const response = await api.post("/admin/login", loginData);
    return response.data;
};

export const getAdminProfile = async () => {
    const response = await api.get("/admin/profile");
    return response.data;
};

export const logoutAdmin = async () => {
    const response = await api.post("/admin/logout");
    return response.data;
};

export const verifyAdminLogin = async (data) => {
    const response = await api.post("/admin/verify-2fa-login", data);
    return response.data;
};

export const disableTwoFactor = async () => {
    const response = await api.put("/admin/profile/2fa/disable");
    return response.data;
};

// ============================
// Admin OTP Password Recovery
// ============================
export const sendAdminForgotOtp = async (email) => {
    const response = await api.post("/admin/forgot-password-otp", { email });
    return response.data;
};

export const resetAdminPasswordWithOtp = async (email, otp, newPassword) => {
    const response = await api.post("/admin/reset-password-otp", {
        email,
        otp,
        newPassword,
    });
    return response.data;
};

// ============================
// Compatibility Stubs
// ============================
export const forgotPassword = async (email) => {
    return sendAdminForgotOtp(email);
};

export const validateResetToken = async () => {
    return { success: true };
};

export const resetPassword = async () => {
    return { success: true };
};