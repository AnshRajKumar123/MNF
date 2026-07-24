const Settings = require("../models/settingsModel");

exports.getSettings = async (req, res) => {
    try {

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.status(200).json(settings);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};