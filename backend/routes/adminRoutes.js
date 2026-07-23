const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    getAdminProfile,
} = require("../controllers/adminController");

const {
    getDashboard,
} = require("../controllers/adminDashboardController");

const {
    getProducts,
    addProduct,
} = require("../controllers/adminProductController");

router.get(
    "/profile",
    authMiddleware,
    adminMiddleware,
    getAdminProfile
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboard
);

router.get(
    "/products",
    authMiddleware,
    adminMiddleware,
    getProducts
);

router.post(
    "/products",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    addProduct
);

module.exports = router;