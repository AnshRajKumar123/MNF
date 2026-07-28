const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");

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

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.isAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin account not found."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save({
            validateBeforeSave: false,
        });

        const resetUrl =
            `${process.env.ADMIN_FRONTEND_URL}/reset-password/${resetToken}`;

        const html = `
            <h2>Admin Password Reset</h2>

            <p>You requested to reset your admin account password.</p>

            <p>
                <a href="${resetUrl}">
                    Reset Password
                </a>
            </p>

            <p>This link expires in 15 minutes.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: "Admin Password Reset",
            html,
        });

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const validateResetToken = async (req, res) => {

    try {

        const { token } = req.params;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: new Date()
            }
        });

        if (!user || !user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reset link is valid."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required."
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: new Date()
            }
        });

        if (!user || !user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    adminLogin,
    verifyTwoFactorLogin,
    adminLogout,
    forgotPassword,
    validateResetToken,
    resetPassword
};