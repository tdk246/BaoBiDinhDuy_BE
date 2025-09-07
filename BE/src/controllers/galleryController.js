const Gallery = require('../models/Gallery');

exports.getAll = async (req, res) => {
  const images = await Gallery.find();
  res.json(images);
};

exports.create = async (req, res) => {
  const image = new Gallery(req.body);
  await image.save();
  res.json(image);
};

exports.delete = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
