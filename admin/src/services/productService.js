import api from "../config/axios";

export const getProducts = async () => {
    const response = await api.get("/admin/products");
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
};