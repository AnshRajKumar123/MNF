const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
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

        res.cookie("userToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {

        // 👇 Add it here
        const user = await User.findById(req.user.id).select("-password");

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("userToken");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

const updateProfile = async (req, res) => {
    try {

        const { phone, country, dial, building, address, pincode, gender, image, } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { phone, country, dial, building, address, pincode, gender, image, },

            {
                new: true,
            }
        ).select("-password");

        // 3️⃣ Return the updated user
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const uploadProfileImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });
        }

        const user = await User.findById(req.user.id);

        // Delete old image if it exists
        if (user.image) {

            const oldImagePath = path.join(
                __dirname,
                "..",
                user.image
            );

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const imagePath = `/uploads/profile/${req.file.filename}`;

        user.image = imagePath;

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

const removeProfileImage = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (user.image) {

            const imagePath = path.join(
                __dirname,
                "..",
                user.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        user.image = "";

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

const forgotPassword = async (req, res) => {

    try {

        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email."
            });
        }

        // Prevent using the wrong portal
        if (role === "admin" && !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This email is not registered as an admin."
            });
        }

        if (role === "customer" && user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Please use the admin portal."
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const baseUrl =
            role === "admin"
                ? process.env.ADMIN_FRONTEND_URL
                : process.env.FRONTEND_URL;

        const resetLink = `${baseUrl}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your MidNight Food Password",
            html: `
                <h2>Password Reset Request</h2>

                <p>Hello ${user.fullName},</p>

                <p>You requested to reset your password.</p>

                <p>
                    <a href="${resetLink}">
                        Reset Password
                    </a>
                </p>

                <p>This link will expire in 15 minutes.</p>

                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully."
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

        // Hash the token received from the URL
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

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
        }

        // Prevent resetting an admin password from the customer endpoint
        if (user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Please use the admin reset password page."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // Clear reset fields
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

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired."
            });
        }

        if (user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Please use the admin reset password page."
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

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    forgotPassword,
    resetPassword,
    validateResetToken
};