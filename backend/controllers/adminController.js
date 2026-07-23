const User = require("../models/User");

const getAdminProfile = async (req, res) => {
    try {

        const admin = await User.findById(req.user.id)
            .select("-password");

        return res.status(200).json({
            success: true,
            admin,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getAdminProfile,
};