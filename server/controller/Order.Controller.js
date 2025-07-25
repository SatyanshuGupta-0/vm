const cron = require("node-cron");
const OrderModel = require("../model/VMOrder.model");
const { v4: uuidv4 } = require("uuid");

cron.schedule("* * * * *", async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const result = await OrderModel.deleteMany({
      status: "cancelled",
      cancelledAt: { $lte: twentyFourHoursAgo },
    });

    if (result.deletedCount > 0) {
     
    } else {
      
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed to delete old cancelled orders:", error.message);
  }
})
// Place an Order
const placeOrderController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      products, // expecting an array of products [{ productId, product_details, quantity }]
      paymentId,
      payment_status,
      delivery_address,
      subTotalAmt,
      totalAmt,
    } = req.body;
    

    if (!products || !Array.isArray(products) || products.length === 0 || !delivery_address) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Missing required fields (products array, delivery_address)",
      });
    }

    const newOrder = new OrderModel({
      userId,
      orderId: uuidv4(),
      products,
      paymentId,
      payment_status,
      delivery_address,
      subTotalAmt,
      totalAmt,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      error: false,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Something went wrong",
    });
  }
};

// Cancel Order
const cancelOrderController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Missing userId or order ID",
      });
    }

    const order = await OrderModel.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    if (["delivered", "cancelled"].includes(order.status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: true,
        message: `Cannot cancel an order that is already ${order.status}`,
      });
    }

    order.payment_status = "cancelled";
    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Something went wrong",
    });
  }
};

// View User's Orders
const viewOrderController = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Missing user ID",
      });
    }

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("products.productId")
      .populate("delivery_address")
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Something went wrong",
    });
  }
};

// Get All Orders - Admin Purpose
const getAllOrdersController = async (req, res) => {
  try {
    const { id: adminId, role } = req.admin;

    let orders;

    if (["admin", "superadmin", "manager"].includes(role)) {
      // 🔓 Admins/managers see all orders
      orders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .populate("products.productId")  // Full product info
        .populate("delivery_address")
        .lean();
    } else {
      // 🔐 Shopkeepers see only orders that include their products
      orders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "products.productId",
          match: { createdBy: adminId },
        })
        .populate("delivery_address")
        .lean();

      // Filter orders with at least one product matching this shopkeeper
      orders = orders.filter((order) =>
        order.products.some((p) => p.productId !== null)
      );
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to fetch orders",
    });
  }
};
// const getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await OrderModel.find()
//       .sort({ createdAt: -1 })
//       // .populate("userId", "name email") // Populate user details (optional)
//       .populate("products.productId")   // Populate product details
//       .populate("delivery_address")     // Populate delivery address
//       .lean();

//     return res.status(200).json({
//       success: true,
//       error: false,
//       message: "All orders fetched successfully",
//       data: orders,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: error.message || "Failed to fetch orders",
//     });
//   }
// };

module.exports = {
  placeOrderController,
  cancelOrderController,
  viewOrderController,
  getAllOrdersController,
};
