const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  img: { type: String, required: true },
  caption: String
});

module.exports = mongoose.model('Gallery', gallerySchema);
