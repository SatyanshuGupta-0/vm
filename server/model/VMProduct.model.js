const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, default: "" },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    modelName: String,
    modelLink: String,
    modelPublicId: String,
    category: String,
    catId: String,
    catName: String,
    subCatId: String,
    subCat: String,
    subCatName: String,
    thirdsubCatId: String,
    thirdsubCatName: String,
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },

    variantOptions: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        color: {
          name: { type: String, required: true },
          price: { type: Number, default: 0 },
          images: [
            {
              url: { type: String, required: true },
              public_id: { type: String, required: true },
            },
          ],
        },
        sizes: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
            name: { type: String },
            scale: {
              x: { type: Number },
              y: { type: Number },
              z: { type: Number },
            },
            width: { type: String },
            oldPrice: { type: Number },
            price: { type: Number },
            stock: { type: Number, default: 0 },
            holeCount: { type: String },
            pcd: { type: String },
            cb: { type: String },
            et: { type: String },
            specificC: [String],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
