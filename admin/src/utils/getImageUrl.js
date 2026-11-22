const backendURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getImageUrl = (image) => {
    // 1. Guard check: Must be a non-empty string
    if (!image || typeof image !== "string") {
        return "";
    }

    // 2. Cloudinary / Remote URLs / Blob Previews
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("blob:")) {
        return image;
    }

    // 3. Local backend uploads fallback
    return `${backendURL}/${image.replace(/^\/+/, "")}`;
};