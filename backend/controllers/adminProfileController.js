const User = require("../models/User");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const getProfile = async (req, res) => {

    try {

        const admin = await User.findById(req.user.id).select("-password");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found."
            });
        }

        res.json({
            success: true,
            admin
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

const updateProfile = async (req, res) => {
    try {

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        if (req.body.fullName) {
            admin.fullName = req.body.fullName;
        }

        if (req.body.phone) {
            admin.phone = req.body.phone;
        }

        // Cloudinary upload
        if (req.file) {

            if (admin.imagePublicId) {
                await cloudinary.uploader.destroy(admin.imagePublicId);
            }

            admin.image = req.file.path;
            admin.imagePublicId = req.file.filename;
        }

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            admin,
        });

    } catch (error) {

        console.error("UPDATE PROFILE ERROR");
        console.error(error);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        admin.password = await bcrypt.hash(newPassword, 10);

        await admin.save();

        res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const setupTwoFactor = async (req, res) => {

    try {

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        // Generate a new secret
        const secret = speakeasy.generateSecret({
            name: `MNF (${admin.email})`
        });

        // Save temporarily
        admin.twoFactorSecret = secret.base32;

        await admin.save();

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            success: true,
            qrCode,
            secret: secret.base32
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const verifyTwoFactor = async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required."
            });
        }

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: "base32",
            token
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code."
            });
        }

        admin.twoFactorEnabled = true;

        await admin.save();

        res.json({
            success: true,
            message: "Two-Factor Authentication enabled successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const disableTwoFactor = async (req, res) => {

    try {

        const admin = await User.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        if (!admin.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: "Two-Factor Authentication is already disabled."
            });
        }

        admin.twoFactorEnabled = false;
        admin.twoFactorSecret = "";

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Two-Factor Authentication has been disabled successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor
};