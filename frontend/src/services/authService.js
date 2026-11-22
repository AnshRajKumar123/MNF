import api from "../config/axios";

// Send 6-digit OTP ("registration" or "forgot_password")
export const sendOtp = async (email, purpose) => {
    const { data } = await api.post("/auth/send-otp", { email, purpose });
    return data;
};

// Register customer with full parameters
export const registerUser = async ({ fullName, email, phone, password, otp }) => {
    const { data } = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
        otp,
    });
    return data;
};

// Sign In
export const loginUser = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
};

// Reset Password with OTP
export const resetPasswordWithOtp = async (email, otp, newPassword) => {
    const { data } = await api.post("/auth/reset-password-otp", {
        email,
        otp,
        newPassword,
    });
    return data;
};

// Legacy link-based functions (kept for safety)
export const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email, role: "customer" });
    return data;
};

export const validateResetToken = async (token) => {
    const { data } = await api.get(`/auth/reset-password/${token}`);
    return data;
};

export const resetPassword = async (token, password) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
};