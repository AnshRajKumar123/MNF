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
    updateProduct,
    deleteProduct
} = require("../controllers/adminProductController");

const {
    getAllOrders,
} = require("../controllers/adminOrderController");

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

router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateProduct
);

router.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

module.exports = router;