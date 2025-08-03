const express = require("express");
const router = express.Router();
const carModelController = require("../controller/carModel.Controller");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// 🌐 Public routes
router.get("/", carModelController.getAllCarModels);          // View all car models
router.get("/:id", carModelController.getCarModelById);       // View a single car model

// 🔒 Admin-only routes
router.post("/",  isAdmin("superadmin"), carModelController.createCarModel);         // Create
router.put("/:id",  isAdmin("superadmin"), carModelController.updateCarModel);       // Update
router.delete("/:id",  isAdmin("superadmin"), carModelController.deleteCarModel);    // Delete

// 🔒 Admin-only: Delete media from Cloudinary
router.post("/deleteImage",  isAdmin("superadmin"), carModelController.deleteImage);
router.post("/deleteModel",  isAdmin("superadmin"), carModelController.deleteModel);

module.exports = router;

