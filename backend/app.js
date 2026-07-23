require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const crypto = require("crypto");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoute = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminCouponRoutes = require("./routes/adminCouponRoutes");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: [
        "http://10.59.92.183:5173", // Customer App
        "http://10.59.92.183:5174", // Admin App
    ],
    credentials: true,
}));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoute);
app.use("/payment", paymentRoutes);
app.use("/invoice", invoiceRoutes);

app.use("/admin", adminRoutes);
app.use("/admin/coupons", adminCouponRoutes);

module.exports = app;