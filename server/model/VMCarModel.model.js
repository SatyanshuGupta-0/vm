const mongoose = require("mongoose");

const carModelSchema = new mongoose.Schema(
  {
    carName: { type: String, required: true },
    brand: { type: String },
    pcd: { type: String },
    cb: { type: String },
    et: { type: String },
    color: { type: String },
    carModelLink: { type: String },
    modelPublicId: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    modelCarYear: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarModel", carModelSchema);
