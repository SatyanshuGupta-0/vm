const mongoose = require('mongoose');

const CartProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: false },
  sizeId: { type: mongoose.Schema.Types.ObjectId, required: false }, // add this
  quantity: { type: Number, required: true },
  // any other fields
});

module.exports = mongoose.model('CartProduct', CartProductSchema);
