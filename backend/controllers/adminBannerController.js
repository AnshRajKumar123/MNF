const Banner = require("../models/bannerModel");

exports.getAllBanners = async (req, res) => {

    try {

        const banners = await Banner.find()
            .sort({ priority: 1 });

        res.json(banners);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.createBanner = async (req, res) => {

    try {

        const banner = await Banner.create({

            title: req.body.title,

            subtitle: req.body.subtitle,

            buttonText: req.body.buttonText,

            buttonLink: req.body.buttonLink,

            priority: req.body.priority,

            active: req.body.active,

            startDate: req.body.startDate,

            endDate: req.body.endDate,

            image: req.file
                ? `/uploads/banners/${req.file.filename}`
                : ""

        });

        res.status(201).json(banner);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.updateBanner = async (req, res) => {

    try {

        const updateData = {

            ...req.body

        };

        if (req.file) {

            updateData.image = `/uploads/banners/${req.file.filename}`;

        }

        const banner = await Banner.findByIdAndUpdate(

            req.params.id,

            updateData,

            {
                new: true
            }

        );

        res.json(banner);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

exports.deleteBanner = async (req, res) => {

    try {

        await Banner.findByIdAndDelete(req.params.id);

        res.json({

            message: "Banner deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};