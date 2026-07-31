const backendURL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image) => {

    if (!image) return "";

    // Cloudinary
    if (image.startsWith("http")) {
        return image;
    }

    // Local uploads
    return `${backendURL}/${image.replace(/^\/+/, "")}`;

};