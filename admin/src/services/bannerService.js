import api from "../config/axios";

export const getBanners = async () => {

    const { data } = await api.get("/admin/banners");

    return data;

};

export const createBanner = async (formData) => {

    const { data } = await api.post(
        "/admin/banners",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

};

export const updateBanner = async (id, formData) => {

    const { data } = await api.put(
        `/admin/banners/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

};

export const deleteBanner = async (id) => {

    await api.delete(`/admin/banners/${id}`);

};