const express = require("express");
const router = express.Router();
const {
  placeOrderController,
  cancelOrderController,
  viewOrderController,
  getAllOrdersController,
  updateOrderStatus,
  checkRefundEligibility,
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
router.get("/all-orders",isAdmin("superadmin","shopkeeper"),  getAllOrdersController);

router.put("/updateStatus/:id",isAdmin("superadmin","shopkeeper"), updateOrderStatus);
router.get("/refund-eligibility/:id", checkRefundEligibility);

module.exports = router;
