const express = require("express");

const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const createUploader = require("../config/multer");

const upload = createUploader("products");

const {
    adminLogin,
    adminLogout,
} = require("../controllers/adminLoginController");

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
    deleteProduct,
} = require("../controllers/adminProductController");

const {
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/adminOrderController");

const {
    getAllUsers,
    getSingleUser,
} = require("../controllers/adminUserController");


// ============================
// Public Routes
// ============================

router.post("/login", adminLogin);

router.post("/logout", adminLogout);


// ============================
// Protected Admin Routes
// ============================

router.get(
    "/profile",
    adminAuthMiddleware,
    adminMiddleware,
    getAdminProfile
);

router.get(
    "/dashboard",
    adminAuthMiddleware,
    adminMiddleware,
    getDashboard
);

router.get(
    "/products",
    adminAuthMiddleware,
    adminMiddleware,
    getProducts
);

router.post(
    "/products",
    adminAuthMiddleware,
    adminMiddleware,
    upload.single("image"),
    addProduct
);

router.put(
    "/products/:id",
    adminAuthMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateProduct
);

router.delete(
    "/products/:id",
    adminAuthMiddleware,
    adminMiddleware,
    deleteProduct
);

router.get(
    "/orders",
    adminAuthMiddleware,
    adminMiddleware,
    getAllOrders
);

router.put(
    "/orders/:id/status",
    adminAuthMiddleware,
    adminMiddleware,
    updateOrderStatus
);

router.get(
    "/users",
    adminAuthMiddleware,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/users/:id",
    adminAuthMiddleware,
    adminMiddleware,
    getSingleUser
);

module.exports = router;