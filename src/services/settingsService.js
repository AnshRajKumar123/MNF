import api from "../config/axios";

export const getSettings = async () => {

    const { data } = await api.get("/settings");

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

        formData.append(key, value);

    });

    const { data } = await api.put(
        "/settings",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

};