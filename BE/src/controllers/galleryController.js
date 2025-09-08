const Gallery = require('../models/Gallery');

exports.getAll = async (req, res) => {
  const images = await Gallery.find();
  const envBase = process.env.PUBLIC_BASE_URL;
  const baseUrl = envBase && envBase.startsWith('http') ? envBase : `${req.protocol}://${req.get('host')}`;
  images.forEach(image => {
    if (!image.img) return;
    try {
      if (image.img.startsWith('http')) {
        const u = new URL(image.img);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
          image.img = baseUrl + u.pathname;
        }
      } else {
        image.img = baseUrl + image.img;
      }
    } catch (e) {
      image.img = baseUrl + image.img;
    }
  });
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
