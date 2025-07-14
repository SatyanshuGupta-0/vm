const SaveChange = require("../model/VMSavechanges.model");

// Add a new car customization
exports.addChange = async (req, res) => {
  try {
    const { userId, carModelId, color, ...parts } = req.body;

    const saved = new SaveChange({
      userId,
      carModelId,
      color,
      ...parts
    });

    await saved.save();
    res.status(201).json({ success: true, message: "Customization saved", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save customization", error: err.message });
  }
};

// Get all saved customizations for a user
exports.getUserChanges = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedChanges = await SaveChange.find({ userId }).populate("carModelId");

    res.status(200).json({ success: true, data: savedChanges });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch customizations", error: err.message });
  }
};

// Update customization by ID
exports.updateChange = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await SaveChange.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Customization not found" });
    }

    res.status(200).json({ success: true, message: "Customization updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update customization", error: err.message });
  }
};

// Delete customization by ID
exports.deleteChange = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SaveChange.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Customization not found" });
    }

    res.status(200).json({ success: true, message: "Customization deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete customization", error: err.message });
  }
};
