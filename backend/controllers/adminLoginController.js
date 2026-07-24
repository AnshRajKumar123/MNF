const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only.",
            });
        }

        if (user.twoFactorEnabled) {
            return res.status(200).json({
                success: true,
                requiresTwoFactor: true,
                adminId: user._id,
                message: "Two-Factor Authentication required.",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            admin: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const verifyTwoFactorLogin = async (req, res) => {
    try {

        const { adminId, token } = req.body;

        if (!adminId || !token) {
            return res.status(400).json({
                success: false,
                message: "Admin ID and verification code are required.",
            });
        }

        const user = await User.findById(adminId);

        if (!user || !user.isAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code.",
            });
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("adminToken", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            admin: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const adminLogout = (req, res) => {

    res.clearCookie("adminToken");

    return res.status(200).json({
        success: true,
        message: "Admin logged out successfully.",
    });

};

module.exports = {
    adminLogin,
    verifyTwoFactorLogin,
    adminLogout,
};