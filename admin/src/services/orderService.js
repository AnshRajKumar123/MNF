import api from "../config/axios";

export const getOrders = async () => {
    const response = await api.get("/admin/orders");
    return response.data;
};

export const updateOrderStatus = async (id, data) => {
    const response = await api.put(
        `/admin/orders/${id}/status`,
        data
    );

    return response.data;
};