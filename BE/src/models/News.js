const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  link: String,
  updatedAt: String
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
