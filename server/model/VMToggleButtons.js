const mongoose = require('mongoose');

const toggleSchema = new mongoose.Schema({
  isClosed: {
    type: Boolean,
    default: false,
  },
  isBuyDisabled: {
    type: Boolean,
    default: true, // Buy button is disabled by default
  },
});

module.exports = mongoose.model('Toggle', toggleSchema);
