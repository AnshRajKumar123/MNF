const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const { sendEmail } = require("../services/emailService");

// 1. SEND OTP (FOR REGISTRATION & FORGOT PASSWORD)
const sendOtp = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email and purpose are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (purpose === "registration" && existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered. Please login.",
            });
        }

        if (purpose === "forgot_password" && !existingUser) {
            return res.status(404).json({
                success: false,
                message: "No registered account found with this email.",
            });
        }

        // Generate 6-digit numeric OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Clear previous unused OTPs for this email and purpose
        await Otp.deleteMany({ email: normalizedEmail, purpose });

        // Save new OTP
        await Otp.create({
            email: normalizedEmail,
            otp: generatedOtp,
            purpose,
        });

        const subject =
            purpose === "registration"
                ? "Verify Your Email - MidNight Food"
                : "Reset Password Code - MidNight Food";

        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #0b1120; padding: 30px; color: #ffffff;">
                <div style="max-width: 500px; margin: 0 auto; background: #161f36; padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="color: #38bdf8; text-align: center; margin-bottom: 8px;">MidNight Food Verification</h2>
                    <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 0;">
                        Use the code below to complete your ${purpose === "registration" ? "account registration" : "password reset"}.
                    </p>
                    <div style="margin: 25px auto; text-align: center; background: #0b1120; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; border: 1px dashed #38bdf8;">
                        ${generatedOtp}
                    </div>
                    <p style="font-size: 12px; color: #64748b; text-align: center;">
                        This code will expire in 10 minutes. If you did not request this, please ignore this email.
                    </p>
                </div>
            </div>
        `;

        await sendEmail({ to: normalizedEmail, subject, html });

        return res.status(200).json({
            success: true,
            message: `Verification code sent to ${normalizedEmail}`,
        });
    } catch (error) {
        console.error("sendOtp Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send verification email.",
        });
    }
};

// 2. REGISTER USER (WITH NAME, EMAIL, PHONE, OTP, PASSWORD)
const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, otp } = req.body;

        if (!fullName || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "Full Name, Email, Password, and OTP are required.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Verify OTP
        const validOtp = await Otp.findOne({
            email: normalizedEmail,
            otp,
            purpose: "registration",
        });

        if (!validOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code.",
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone: phone ? phone.trim() : "",
            password: hashedPassword,
        });

        // Clean up OTP record
        await Otp.deleteMany({ email: normalizedEmail, purpose: "registration" });

        return res.status(201).json({
            success: true,
            message: "Account registered successfully! Please log in.",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("registerUser Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 3. LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("userToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
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

// 4. RESET PASSWORD WITH OTP (NEW SECURE IN-PLACE RESET)
const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const validOtp = await Otp.findOne({
            email: normalizedEmail,
            otp,
            purpose: "forgot_password",
        });

        if (!validOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code.",
            });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await Otp.deleteMany({ email: normalizedEmail, purpose: "forgot_password" });

        return res.status(200).json({
            success: true,
            message: "Password updated successfully! Please sign in with your new password.",
        });
    } catch (error) {
        console.error("resetPasswordWithOtp Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 5. GET USER PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 6. LOGOUT
const logoutUser = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("userToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// 7. UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const {
            phone,
            country,
            dial,
            building,
            address,
            pincode,
            gender,
        } = req.body;

        const updateData = {
            phone,
            country,
            dial,
            building,
            address,
            pincode,
            gender,
        };

        if (req.file) {
            const user = await User.findById(req.user.id);
            if (user.imagePublicId) {
                await cloudinary.uploader.destroy(user.imagePublicId);
            }
            updateData.image = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 8. UPLOAD PROFILE IMAGE
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });
        }

        const user = await User.findById(req.user.id);
        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId);
        }

        user.image = req.file.path;
        user.imagePublicId = req.file.filename;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully.",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 9. REMOVE PROFILE IMAGE
const removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId);
        } else if (user.image) {
            const imagePath = path.join(__dirname, "..", user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        user.image = "";
        user.imagePublicId = "";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image removed successfully.",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 10. BACKWARD-COMPATIBLE LINK-BASED RESET (FOR ADMIN/LEGACY COMPATIBILITY)
const forgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required." });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ success: false, message: "No account found with this email." });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const baseUrl = role === "admin" ? process.env.ADMIN_FRONTEND_URL : process.env.FRONTEND_URL;
        const resetLink = `${baseUrl}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your MidNight Food Password",
            html: `<h2>Password Reset Request</h2><p>Click <a href="${resetLink}">here</a> to reset your password. Valid for 15 minutes.</p>`,
        });

        return res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) return res.status(400).json({ success: false, message: "Password is required." });

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset link." });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = "";
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ success: false, message: "Reset link is invalid or expired." });
        return res.status(200).json({ success: true, message: "Reset link is valid." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendOtp,
    registerUser,
    loginUser,
    resetPasswordWithOtp,
    getProfile,
    logoutUser,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    forgotPassword,
    resetPassword,
    validateResetToken,
};