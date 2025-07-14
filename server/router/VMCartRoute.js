const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  addToCartItemController,
  getCartItemController,
  updateCartItemQtyController,
  deleteCartItemController
} = require("../controller/cart.controller");

// User-only routes
router.post("/add", auth, addToCartItemController);               // Add item to cart
router.get("/get", auth, getCartItemController);                  // Get user's cart items
router.put("/update-qty", auth, updateCartItemQtyController);     // Update quantity
router.delete("/delete-cart-item/:id", auth, deleteCartItemController); // Delete item

module.exports = router;
