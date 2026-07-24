const fs = require("fs");
const path = require("path");

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

        // Upload new logo
        if (req.file) {

            // Delete old logo
            if (settings.restaurantLogo) {

                const oldPath = path.join(
                    __dirname,
                    "..",
                    settings.restaurantLogo
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }

            }

            req.body.restaurantLogo =
                `/uploads/settings/${req.file.filename}`;
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