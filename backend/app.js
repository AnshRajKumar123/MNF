require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRoutes);

module.exports = app;