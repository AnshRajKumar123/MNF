const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    console.log("Cookies:", req.cookies);

    const token =
        req.cookies.token ||
        (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please login first.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;