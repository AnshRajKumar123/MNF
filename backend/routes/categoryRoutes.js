const express = require("express");

const router = express.Router();

const createUploader = require("../config/multer");

const uploadCategory = createUploader("categories");

const {
    createCategory,
    getAllCategories,
} = require("../controllers/categoryController");

router.post(
    "/create",
    uploadCategory.single("image"),
    createCategory
);

router.get(
    "/all",
    getAllCategories
);

module.exports = router;