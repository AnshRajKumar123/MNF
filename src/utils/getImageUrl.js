// src/utils/getImageUrl.js

const backendURL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image) => {

    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `${backendURL}/${image.replace(/^\/+/, "")}`;
};