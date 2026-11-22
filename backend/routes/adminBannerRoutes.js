const express = require("express");

const router = express.Router();

const createUploader = require("../config/multer");
const upload = createUploader("banners");

const adminAuth = require("../middleware/adminAuthMiddleware");

const {

    getAllBanners,

    createBanner,

    updateBanner,

    deleteBanner

} = require("../controllers/adminBannerController");

router.get("/", adminAuth, getAllBanners);

router.post(
    "/",
    adminAuth,
    upload.single("image"),
    createBanner
);

router.put(
    "/:id",
    adminAuth,
    upload.single("image"),
    updateBanner
);

router.delete(
    "/:id",
    adminAuth,
    deleteBanner
);

module.exports = router;