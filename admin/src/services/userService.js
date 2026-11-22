import api from "../config/axios";

// Get all users
export const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

// Get single user
export const getUser = async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
};