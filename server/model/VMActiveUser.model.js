const mongoose = require("mongoose");

const activeUserSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
  },
  ip: String,
  userAgent: String,
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ActiveUser", activeUserSchema);
