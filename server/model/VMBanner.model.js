const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  public_id: {
    type: String,
    required: [true, "Image public_id is required"],
  },
  type: {
    type: String,
    enum: ["image", "video"], // ✅ Only allow "image" or "video"
    required: [true, "Image type (image or video) is required"],
  },
});

const homeBannerSchema = new mongoose.Schema(
  {
    image: {
      type: [imageSchema],
      validate: [(val) => val.length > 0, "At least one image is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
