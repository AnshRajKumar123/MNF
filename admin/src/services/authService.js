import api from "../config/axios";

export const loginAdmin = async (loginData) => {

    const response = await api.post(
        "/auth/login",
        loginData
    );

    return response.data;
};

export const getAdminProfile = async () => {

    const response = await api.get(
        "/admin/profile"
    );

    return response.data;
};

export const logoutAdmin = async () => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};