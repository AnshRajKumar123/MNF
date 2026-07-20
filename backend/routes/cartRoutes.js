const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeCartItem,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove/:cartId", authMiddleware, removeCartItem);

module.exports = router;