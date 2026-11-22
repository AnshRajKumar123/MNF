const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");

const createUploader = (folderName) => {

    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folderName,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
    });

    const fileFilter = (req, file, cb) => {

        const allowedTypes = /jpeg|jpg|png|webp/;

        const isValid =
            allowedTypes.test(file.mimetype) &&
            allowedTypes.test(
                path.extname(file.originalname).toLowerCase()
            );

        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }

    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });

};

module.exports = createUploader;