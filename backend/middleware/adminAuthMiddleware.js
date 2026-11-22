const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {

    const token =
        req.cookies.adminToken ||
        (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login as admin.",
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token.",
        });

    }

};

module.exports = adminAuthMiddleware;