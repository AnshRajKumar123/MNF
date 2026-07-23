import api from "../config/axios";

export const getCoupons = async (params = {}) => {
    const res = await api.get("/admin/coupons", {
        params,
    });

    return res.data;
};

export const createCoupon = async (data) => {
    const res = await api.post("/admin/coupons", data);
    return res.data;
};

export const updateCoupon = async (id, data) => {
    const res = await api.put(`/admin/coupons/${id}`, data);
    return res.data;
};

export const deleteCoupon = async (id) => {
    const res = await api.delete(`/admin/coupons/${id}`);
    return res.data;
};

export const toggleCoupon = async (id) => {
    const res = await api.patch(`/admin/coupons/${id}/toggle`);
    return res.data;
};

export const getCoupon = async (id) => {
    const res = await api.get(`/admin/coupons/${id}`);
    return res.data;
};