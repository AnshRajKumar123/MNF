const Banner = require("../models/bannerModel");

const getPublicBanners = async (req, res) => {
    try {
        const now = new Date();

        const banners = await Banner.find({
            active: true,
            $or: [
                { startDate: { $exists: false } },
                { startDate: null },
                { startDate: { $lte: now } }
            ],
            $and: [
                {
                    $or: [
                        { endDate: { $exists: false } },
                        { endDate: null },
                        { endDate: { $gte: now } }
                    ]
                }
            ]
        }).sort({ priority: 1 });

        res.json({ banners });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getPublicBanners
};