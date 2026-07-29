const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploader = (folderName) => {

    const uploadPath = path.join(__dirname, "..", "uploads", folderName);

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {

            const uniqueName =
                Date.now() + "-" + Math.round(Math.random() * 1e9);

            cb(
                null,
                uniqueName + path.extname(file.originalname)
            );

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
            cb(new Error("Only image files are allowed!"));
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