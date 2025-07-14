const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  addAddressController,
  getUserAddressesController,
  getAddressController,
  updateAddressController,
  deleteAddressController,
} = require("../controller/Address.Controller");

// Add new address (authenticated users only)
router.post("/", auth, addAddressController);

// Get all addresses for logged-in user
router.get("/", auth, getUserAddressesController);

// Get a single address by ID (also protect this)
router.get("/:id", auth, getAddressController);

// Update an address (authenticated users only)
router.put("/:id", auth, updateAddressController);

// Delete an address (authenticated users only)
router.delete("/:id", auth, deleteAddressController);

module.exports = router;
