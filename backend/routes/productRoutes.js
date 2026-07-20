const express = require("express");

const router = express.Router();

const {
    getAllProducts,
} = require("../controllers/productController");

router.get("/all", getAllProducts);

module.exports = router;