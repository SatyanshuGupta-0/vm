const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    brand: { type: String, default: "" },
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
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'VMAdmin', // or 'Admin', depending on your schema
  required: true
},


    variantOptions: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        color: {
          name: { type: String,},
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

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  // If slug already exists → do nothing
  if (update.slug) return next();

  const name = update.name;
  const brand = update.brand;

  if (!name && !brand) return next();

  const raw = `${brand || ""} ${name || ""}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = raw;
  let count = 1;

  while (await mongoose.models.Product.findOne({ slug })) {
    slug = `${raw}-${count++}`;
  }

  update.slug = slug;
  this.setUpdate(update);

  next();
});


module.exports = mongoose.model("Product", productSchema);







