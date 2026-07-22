const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { downloadInvoice } = require("../controllers/invoiceController");

router.get("/:orderId", authMiddleware, downloadInvoice);

module.exports = router;