// models/ImageCollection.js
const mongoose = require('mongoose');

const imageCollectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [
    {
      imageUrl: String,
      filename: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ImageCollection', imageCollectionSchema);
