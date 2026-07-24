import api from "../config/axios";

// ============================
// Admin Login
// ============================

export const loginAdmin = async (loginData) => {

    const response = await api.post(
        "/admin/login",
        loginData
    );

    return response.data;
};

// ============================
// Admin Profile
// ============================

export const getAdminProfile = async () => {

    const response = await api.get(
        "/admin/profile"
    );

    return response.data;
};

// ============================
// Admin Logout
// ============================

export const logoutAdmin = async () => {

    const response = await api.post(
        "/admin/logout"
    );

    return response.data;
};

export const verifyAdminLogin = async (data) => {

    const response = await api.post(
        "/admin/verify-2fa-login",
        data
    );

    return response.data;

};

export const disableTwoFactor = async () => {

    const response = await api.put(
        "/admin/profile/2fa/disable"
    );

    return response.data;

};