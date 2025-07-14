const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productTitle: String,
    image: String,
    rating: Number,
    price: Number,
    oldPrice: Number,
    brand: String,
    discount: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

module.exports = WishlistModel;
