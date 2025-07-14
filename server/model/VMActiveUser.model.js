const mongoose = require('mongoose');

const activeUserSchema = new mongoose.Schema({
  ip: String,
  lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActiveUser', activeUserSchema);
