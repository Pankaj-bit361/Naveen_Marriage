const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
