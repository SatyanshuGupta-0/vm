const CartProductModel = require("../model/VMCartproduct.model");
const UserModel = require("../model/VMUsermodel");
const Product = require('../model/VMProduct.model');


async function addToCartItemController(req, res) {
  try {
    const userId = req.user.id;
    const { productId, variantId, sizeId, quantity, selectedOptions } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Provide productId and quantity",
        error: true,
        success: false,
      });
    }

    // Check if same product + variant combo is already in cart
    const existingItem = await CartProductModel.findOne({ userId, productId, variantId, sizeId });

    if (existingItem) {
      return res.status(400).json({
        message: "Item already in cart",
        error: true,
        success: false,
      });
    }

    const cartItem = new CartProductModel({
      quantity,
      userId,
      productId,
      variantId,
      sizeId,// save variantId
      selectedOptions, // optional: save selected options (color, size, etc)
    });

    const savedItem = await cartItem.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { shopping_cart: productId },
    });

    return res.status(200).json({
      data: savedItem,
      message: "Item added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getCartItemController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cartItems = await CartProductModel.find({ userId })
      .populate('productId')  // always populated
      // .populate('variantId')  // may be null for some items
      .lean();

    return res.json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}




async function updateCartItemQtyController(req, res) {
  try {
    const userId = req.user.id;
    const { _id, qty } = req.body;

    if (!_id || qty == null) {
      return res.status(400).json({
        message: "Provide _id and qty",
        error: true,
        success: false,
      });
    }

    const updated = await CartProductModel.updateOne(
      { _id, userId },
      { quantity: qty }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        message: "Cart item not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Cart updated",
      data: updated,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function deleteCartItemController(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    if (!userId || !id) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Missing user ID or cart item ID",
      });
    }

    const cartItem = await CartProductModel.findOne({ _id: id, userId });

    if (!cartItem) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Cart item not found",
      });
    }

    await CartProductModel.findByIdAndDelete(id);

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: cartItem.productId.toString() },
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Cart item removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function clearCartController(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Missing user ID",
      });
    }

    // Delete all cart items for this user
    await CartProductModel.deleteMany({ userId });

    // Optionally clear the user's cart reference array if you're maintaining one
    await UserModel.findByIdAndUpdate(userId, {
      $set: { shopping_cart: [] },
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Cart cleared successfully",
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
  addToCartItemController,
  getCartItemController,
  updateCartItemQtyController,
  deleteCartItemController,
  clearCartController,
};
