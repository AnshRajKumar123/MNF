const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const { sendEmail } = require("../services/emailService");

// ============================
// ADMIN LOGIN
// ============================
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const admin = await User.findOne({ email: normalizedEmail });

        if (!admin || !admin.isAdmin) {
            return res.status(401).json({
                success: false,
                message: "Invalid administrator credentials.",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid administrator credentials.",
            });
        }

        // Handle Two-Factor Authentication if enabled
        if (admin.twoFactorEnabled) {
            return res.status(200).json({
                success: true,
                requiresTwoFactor: true,
                adminId: admin._id,
            });
        }

        const token = jwt.sign(
            { id: admin._id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Authentication successful.",
            token,
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                isAdmin: admin.isAdmin,
            },
        });
    } catch (error) {
        console.error("adminLogin Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================
// 2FA VERIFICATION ON LOGIN
// ============================
const verifyTwoFactorLogin = async (req, res) => {
    try {
        const { adminId, token } = req.body;

        if (!adminId || !token) {
            return res.status(400).json({
                success: false,
                message: "Admin ID and 2FA token are required.",
            });
        }

        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                success: false,
                message: "Administrator not found.",
            });
        }

        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: "base32",
            token,
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid authentication code.",
            });
        }

        const authToken = jwt.sign(
            { id: admin._id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("adminToken", authToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "2FA Verification successful.",
            token: authToken,
            admin,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================
// ADMIN LOGOUT
// ============================
const adminLogout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Administrator logged out successfully.",
    });
};

// ==========================================================
// 1. SEND OTP FOR ADMIN FORGOT PASSWORD
// ==========================================================
const sendAdminForgotOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        // Query User model verifying that this account is an administrator
        const adminUser = await User.findOne({ email: normalizedEmail, isAdmin: true });

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "No registered administrator account found with this email.",
            });
        }

        // Generate 6-digit numeric OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Clear previous unused OTPs for this admin email
        await Otp.deleteMany({ email: normalizedEmail, purpose: "admin_forgot_password" });

        // Save fresh OTP (TTL index purges in 10 minutes)
        await Otp.create({
            email: normalizedEmail,
            otp: generatedOtp,
            purpose: "admin_forgot_password",
        });

        const subject = "Admin Console Password Reset OTP - MidNight Food";
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #090d16; padding: 30px; color: #ffffff;">
                <div style="max-width: 500px; margin: 0 auto; background: #111726; padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 11px; font-weight: bold; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.3);">
                            ADMIN CONSOLE SECURITY
                        </span>
                        <h2 style="color: #ffffff; margin-top: 15px;">Administrator Password Recovery</h2>
                    </div>
                    <p style="font-size: 14px; color: #94a3b8; text-align: center;">
                        Hello <strong>${adminUser.fullName || "Administrator"}</strong>,<br/>
                        A request was submitted to reset your administrative password. Use the verification code below:
                    </p>
                    <div style="margin: 25px auto; text-align: center; background: #090d16; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6366f1; border: 1px dashed #6366f1;">
                        ${generatedOtp}
                    </div>
                    <p style="font-size: 12px; color: #64748b; text-align: center;">
                        This code expires in 10 minutes. If you did not request this, please secure your administrative account immediately.
                    </p>
                </div>
            </div>
        `;

        await sendEmail({ to: normalizedEmail, subject, html });

        return res.status(200).json({
            success: true,
            message: `Verification OTP sent to ${normalizedEmail}`,
        });
    } catch (error) {
        console.error("sendAdminForgotOtp Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to dispatch administrator verification code.",
        });
    }
};

// ==========================================================
// 2. VERIFY OTP AND SET NEW ADMIN PASSWORD
// ==========================================================
const resetAdminPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP code, and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Admin password must be at least 6 characters.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Verify valid OTP
        const validOtp = await Otp.findOne({
            email: normalizedEmail,
            otp,
            purpose: "admin_forgot_password",
        });

        if (!validOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired admin verification code.",
            });
        }

        // Query the single User collection ensuring admin privileges
        const adminUser = await User.findOne({ email: normalizedEmail, isAdmin: true });
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Administrator account not found.",
            });
        }

        // Hash and save new password
        adminUser.password = await bcrypt.hash(newPassword, 10);
        await adminUser.save();

        // Purge used OTP
        await Otp.deleteMany({ email: normalizedEmail, purpose: "admin_forgot_password" });

        return res.status(200).json({
            success: true,
            message: "Admin password updated successfully! Please log in to the console.",
        });
    } catch (error) {
        console.error("resetAdminPasswordWithOtp Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    adminLogin,
    verifyTwoFactorLogin,
    adminLogout,
    sendAdminForgotOtp,
    resetAdminPasswordWithOtp,
};