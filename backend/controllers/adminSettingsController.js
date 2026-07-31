const cloudinary = require("../config/cloudinary");
const Settings = require("../models/settingsModel");

exports.getSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create({});

        }

        res.json(settings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.updateSettings = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        if (req.file) {

            // Delete previous Cloudinary logo
            if (settings.restaurantLogoPublicId) {
                await cloudinary.uploader.destroy(settings.restaurantLogoPublicId);
            }

            req.body.restaurantLogo = req.file.path;
            req.body.restaurantLogoPublicId = req.file.filename;
        }

        // ⭐ ADD THIS BLOCK HERE
        if (req.body.delivery) {
            req.body.delivery = JSON.parse(req.body.delivery);
        }

        if (req.body.payment) {
            req.body.payment = JSON.parse(req.body.payment);
        }

        if (req.body.notifications) {
            req.body.notifications = JSON.parse(req.body.notifications);
        }

        if (req.body.appearance) {
            req.body.appearance = JSON.parse(req.body.appearance);
        }

        Object.assign(settings, req.body);

        await settings.save();

        res.json({
            message: "Settings updated successfully",
            settings
        });

    } catch (error) {

        console.error("========== ERROR ==========");
        console.error(error);
        console.error(error.stack);

        res.status(500).json({
            message: error.message,
        });

    }

};