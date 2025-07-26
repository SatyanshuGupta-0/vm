const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: String,
    required: [true, "Provide orderId"],
    unique: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
      type: mongoose.Schema.ObjectId,
      required: true, // or false if optional
    },
      sizeId: {
      type: mongoose.Schema.ObjectId,
      required: true, // or false if optional
    },
      quantity: {
        type: Number,
        default: 1,
      },
     product_details: {
  name: String,
  image: [String],
  price: Number,
  oldPrice: Number,      // optional, for showing discounts
  discount: Number,      // optional, % discount if you want to store it separately
  color: String,
  size: String,
},

    },
  ],
  paymentId: {
    type: String,
    default: "",
  },
  payment_method:{
    type: String,
    
  },
  payment_status: {
    type: String,
    default: "",
  },
  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: "Address",
  },
  subTotalAmt: {
    type: Number,
    default: 0,
  },
  totalAmt: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["placed", "cancelled"],
    default: "placed",
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;
