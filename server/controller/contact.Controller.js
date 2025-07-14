const Contact = require("../model/VMContact.model");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.status(201).json({ success: true, message: "Message received successfully!" });
  } catch (error) {
    console.error("Error saving contact:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

module.exports = { createContact };
