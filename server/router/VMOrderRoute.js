const express = require("express");
const router = express.Router();
const {
  placeOrderController,
  cancelOrderController,
  viewOrderController,
  getAllOrdersController,
} = require("../controller/Order.Controller");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Place a new order
router.post("/place", auth, placeOrderController);

// Cancel an order (by the user who placed it or admin)
router.put("/cancel/:id", auth, cancelOrderController);

// View current user's orders
router.get("/user-orders", auth, viewOrderController);

// Admin: View all orders
router.get("/all-orders", isAdmin, getAllOrdersController);

module.exports = router;
