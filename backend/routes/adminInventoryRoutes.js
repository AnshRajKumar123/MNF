const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuthMiddleware");

const {
    getInventory,
    updateStock
} = require("../controllers/adminInventoryController");

router.get("/", adminAuth, getInventory);

router.put("/:id", adminAuth, updateStock);

module.exports = router;