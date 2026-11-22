const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createOrder,
    verifyPayment,
    payExistingOrder,
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);

router.post("/verify", verifyPayment);

router.post("/pay-existing-order", authMiddleware, payExistingOrder);

module.exports = router;