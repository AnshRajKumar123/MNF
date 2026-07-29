import api from "../config/axios";

// Forgot Password
export const forgotPassword = async (email) => {

    const { data } = await api.post(
        "/auth/forgot-password",
        { email, role: "customer"}
    );

    return data;
};

// Validate Reset Token
export const validateResetToken = async (token) => {

    const { data } = await api.get(
        `/auth/reset-password/${token}`
    );

    return data;
};

// Reset Password
export const resetPassword = async (token, password) => {

    const { data } = await api.post(
        `/auth/reset-password/${token}`,
        { password }
    );

    return data;
};