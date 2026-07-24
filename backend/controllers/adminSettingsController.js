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

        const settings = await Settings.findOneAndUpdate(
            {},
            req.body,
            {
                new: true,
                upsert: true
            }
        );

        res.json({
            message: "Settings updated successfully",
            settings
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};