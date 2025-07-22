const wishlistModel = require("../model/VMWishlist.model");
const userModel = require("../model/VMUsermodel");
const Product = require("../model/VMProduct.model"); // adjust to your model path

async function getProductWithVariantController(req, res) {
  const { productId, variantId } = req.params;

  try {
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variant = product.variantOptions?.find(
  (v) => v._id.toString() === variantId
);


    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Combine product info with variant info
    const responseData = {
      _id: product._id,
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category,
      images: variant.images || product.images,
      price: variant.price,
      oldPrice: variant.oldPrice || product.oldPrice,
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
      // add any other variant or product fields you want to expose
    };

    return res.json({ data: responseData });
  } catch (error) {
    console.error("Error fetching product with variant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



async function addToWishlistController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Unauthorized: user not found",
      });
    }

  const {
  productId,
  variantId,
  sizeId,
} = req.body;

if (!productId || !variantId) {
  return res.status(400).json({
    error: true,
    success: false,
    message: "productId and variantId are required",
  });
}

const existingItem = await wishlistModel.findOne({ userId, productId, variantId, sizeId });

if (existingItem) {
  return res.status(400).json({
    error: true,
    success: false,
    message: "Item already in Wishlist",
  });
}

const wishlist = new wishlistModel({
  productId,
  variantId,
  sizeId,
});


    await wishlist.save();

    // Update user's wishlist array
    await userModel.findByIdAndUpdate(userId, {
      $push: { wishlist: wishlist._id }
    });

    return res.status(201).json({
      error: false,
      success: true,
      message: "The product saved in the wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function deleteToWishlistController(req, res) {
  try {
    const userId = req.user?.id;
    const id = req.params.id;

    if (!userId || !id) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Missing user ID or wishlist item ID",
      });
    }

    const item = await wishlistModel.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Item not found",
      });
    }

    await wishlistModel.findByIdAndDelete(id);

    // Remove from user's wishlist array
    await userModel.findByIdAndUpdate(userId, {
      $pull: { wishlist: id }
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getWishlistController(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const wishlistItems = await wishlistModel
  .find({ userId })
  .populate("productId")
  .lean();


    return res.status(200).json({
      error: false,
      success: true,
      wishlist: wishlistItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = {
  addToWishlistController,
  deleteToWishlistController,
  getWishlistController,
  getProductWithVariantController,
};
