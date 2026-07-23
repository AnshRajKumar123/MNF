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