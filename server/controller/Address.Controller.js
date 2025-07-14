const AddressModel = require("../model/VMAddress.model");
const UserModel = require("../model/VMUsermodel");
// Add a new address
const addAddressController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
    } = req.body;

    // Step 1: Create the new address
    const newAddress = new AddressModel({
      userId,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status: status ?? true,
    });

    await newAddress.save();

    // Step 2: Push address ID to the user.address_details array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: newAddress._id },
    });

    res.status(201).json({ success: true, data: newAddress });

  } catch (error) {
    console.error("Add Address Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses for logged-in user
const getUserAddressesController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const addresses = await AddressModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single address by ID
const getAddressController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const address = await AddressModel.findOne({ _id: id, userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address by ID
const updateAddressController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const allowedFields = [
      "address_line", "city", "state", "pincode", "country", "mobile", "status"
    ];

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: id, userId }, // ensure address belongs to the user
      updateData,
      { new: true, runValidators: true }
    );
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { address_details: id } },
      { new: true }
    );


    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });

  } catch (error) {
    console.error("Update Address Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address by ID
const deleteAddressController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deleted = await AddressModel.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAddressController,
  getUserAddressesController,
  getAddressController,
  updateAddressController,
  deleteAddressController,
};
