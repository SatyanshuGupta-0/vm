const HomeBanner = require("../model/VMBanner.model");
const cloudinary = require('../config/cloudinaryConfig');

// ✅ Add a new banner
const addBanner = async (req, res) => {
  try {
    const { image } = req.body;

    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image array with at least one item is required",
      });
    }

    for (const img of image) {
      if (!img.url || !img.public_id || !img.type) {
        return res.status(400).json({
          success: false,
          message: "Each image must include 'url', 'public_id', and 'type'",
        });
      }
    }

    const banner = await HomeBanner.create({ image });

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: banner,
    });
  } catch (err) {
    console.error("addBanner error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// ✅ Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update a banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image array with at least one item is required for update",
      });
    }

    const updated = await HomeBanner.findByIdAndUpdate(id, { image }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete a full banner (with Cloudinary files)
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await HomeBanner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    for (const media of banner.image) {
      if (media.public_id && media.type) {
        await cloudinary.uploader.destroy(media.public_id, {
          resource_type: media.type === "video" ? "video" : "image",
        });
      }
    }

    await HomeBanner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Banner deleted from DB and Cloudinary",
    });
  } catch (err) {
    console.error("deleteBanner error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Remove individual image or video from Cloudinary
const removeImageFromCloudinary = async (req, res) => {
  try {
    const { public_id, type } = req.body;

    if (!public_id || !type) {
      return res.status(400).json({
        success: false,
        message: "Both 'public_id' and 'type' ('image' or 'video') are required",
      });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: type === "video" ? "video" : "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({
        success: false,
        message: "Failed to delete media from Cloudinary",
        result,
      });
    }

    res.status(200).json({ success: true, message: "Media deleted from Cloudinary" });
  } catch (error) {
    console.error("removeImageFromCloudinary error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get the latest banner (for frontend home view)
const getSingleBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findOne().sort({ createdAt: -1 });

    if (!banner) {
      return res.status(404).json({ success: false, message: "No banner found" });
    }

    res.status(200).json({ success: true, url: banner.image });
  } catch (err) {
    console.error("getSingleBanner error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  removeImageFromCloudinary,
  getSingleBanner,
};
