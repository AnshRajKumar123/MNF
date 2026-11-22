import api from "../config/axios";

export const getSettings = async () => {
    const { data } = await api.get("/admin/settings");
    return data;
};

export const updateSettings = async (settings) => {
    const formData = new FormData();

    Object.keys(settings).forEach((key) => {
        // Exclude UI preview string from payload
        if (key === "restaurantLogoPreview") return;

        // If a new File was picked, append raw binary file
        if (key === "restaurantLogo" && settings[key] instanceof File) {
            formData.append("restaurantLogo", settings[key]);
        } 
        // Stringify nested objects (delivery, payment, notifications, appearance)
        else if (typeof settings[key] === "object" && settings[key] !== null) {
            formData.append(key, JSON.stringify(settings[key]));
        } 
        // Append all standard fields
        else {
            formData.append(key, settings[key] ?? "");
        }
    });

    const { data } = await api.put("/admin/settings", formData);
    return data;
};