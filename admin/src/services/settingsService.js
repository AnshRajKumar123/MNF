import api from "../config/axios";

export const getSettings = async () => {
    const { data } = await api.get("/admin/settings");
    return data;
};

export const updateSettings = async (settings) => {

    const formData = new FormData();

    Object.entries(settings).forEach(([key, value]) => {

        if (key === "restaurantLogoPreview") return;

        if (key === "restaurantLogo") {
            if (value instanceof File) {
                formData.append("restaurantLogo", value);
            }
            return;
        }

        if (typeof value === "object" && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value);
        }

    });

    const { data } = await api.put(
        "/admin/settings",
        formData
    );

    return data;

};