import api from "../config/axios";

export const getProducts = async () => {
    const response = await api.get("/admin/products");
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
};

export const addProduct = async (formData) => {

    const response = await api.post(
        "/admin/products",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;

};