const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const {
  addToWishlistController,
  deleteToWishlistController,  // make sure your controller uses this exact name
  getWishlistController,
  getProductWithVariantController,
} = require("../controller/Wishlist.controller");


router.post("/add", auth, addToWishlistController );
router.delete("/:id", auth, deleteToWishlistController);
router.get("/", auth, getWishlistController);
router.get("/get/:productId/:variantId",auth, getProductWithVariantController);

module.exports = router;
