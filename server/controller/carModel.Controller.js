const CarModel = require("../model/VMCarModel.model");

// Create Car Model (no file upload, just save data from frontend)
const createCarModel = async (req, res) => {
  try {
    const {
      carName,
      brand,
      pcd,
      cb,
      et,
      color,
      modelCarYear,
      carModelLink,
      modelPublicId,
      imageUrl,
      imagePublicId,
    } = req.body;

    const newCarModel = new CarModel({
      carName,
      brand,
      pcd,
      cb,
      et,
      color,
      modelCarYear,
      carModelLink,
      modelPublicId,
      imageUrl,
      imagePublicId,
    });

    const saved = await newCarModel.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all car models
const getAllCarModels = async (req, res) => {
  try {
    const carModels = await CarModel.find().sort({ createdAt: -1 });
    res.json(carModels);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get car model by ID
const getCarModelById = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id);
    if (!carModel) return res.status(404).json({ message: "Car model not found" });
    res.json(carModel);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update car model (no image upload here either)
const updateCarModel = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id);
    if (!carModel) return res.status(404).json({ message: "Car model not found" });

    const fieldsToUpdate = [
      "carName", "brand", "pcd", "cb", "et", "color",
      "carModelLink", "modelPublicId", "modelCarYear",
      "imageUrl", "imagePublicId"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        carModel[field] = req.body[field];
      }
    });

    const updated = await carModel.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Cloudinary & multer setup for delete operations and any future uploads
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Delete image from Cloudinary (called from frontend via backend)
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "public_id required" });

    await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Failed to delete image", err);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

// Delete 3D model from Cloudinary
const deleteModel = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "public_id required" });

    await cloudinary.uploader.destroy(public_id, { resource_type: "raw" });
    res.json({ message: "Model deleted" });
  } catch (err) {
    console.error("Failed to delete model", err);
    res.status(500).json({ message: "Failed to delete model" });
  }
};

// Delete entire car model and Cloudinary resources
const deleteCarModel = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id);
    if (!carModel) return res.status(404).json({ message: "Car model not found" });

    if (carModel.imagePublicId) {
      await cloudinary.uploader.destroy(carModel.imagePublicId, { resource_type: "image" });
    }
    if (carModel.modelPublicId) {
      await cloudinary.uploader.destroy(carModel.modelPublicId, { resource_type: "raw" });
    }

    await CarModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Car model deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createCarModel,
  getAllCarModels,
  getCarModelById,
  updateCarModel,
  deleteCarModel,
  deleteImage,
  deleteModel,
  upload, // export if needed for future uploads
};
