const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    placeOrder,
    myOrders,
    getOrder,
} = require("../controllers/orderController");

router.post("/place", authMiddleware, placeOrder);

router.get("/my-orders", authMiddleware, myOrders);

router.get("/:id", authMiddleware, getOrder);

module.exports = router;