const fs = require("fs");
const path = require("path");

const deleteImage = (imagePath) => {

    if (!imagePath) return;

    const fullPath = path.join(__dirname, "..", imagePath);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }

};

module.exports = deleteImage;