const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin"); // note lowercase for consistency

const {
  addBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  removeImageFromCloudinary,
  getSingleBanner,
} = require("../controller/Banner.Controller");

// PUBLIC: Get all banners
router.get("/", getBanners);

// PUBLIC: Get latest single banner (video/image URL)
router.get("/videourl", getSingleBanner);

// ADMIN ONLY: Add, update, delete banners and remove images
router.post("/",  isAdmin, addBanner);
router.put("/:id",  isAdmin, updateBanner);
router.post("/removeImage",  isAdmin, removeImageFromCloudinary);
router.delete("/:id",  isAdmin, deleteBanner);

module.exports = router;
