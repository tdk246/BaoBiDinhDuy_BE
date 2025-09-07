const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: String,
  link: String
});

module.exports = mongoose.model('Banner', bannerSchema);
