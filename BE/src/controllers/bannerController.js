const Banner = require('../models/Banner');

exports.getAll = async (req, res) => {
  const banners = await Banner.find();
  const envBase = process.env.PUBLIC_BASE_URL;
  const baseUrl = envBase && envBase.startsWith('http') ? envBase : `${req.protocol}://${req.get('host')}`;
  banners.forEach(banner => {
    if (banner.img && !banner.img.startsWith('http')) {
      banner.img = baseUrl + banner.img;
    }
  });
  res.json(banners);
};

exports.create = async (req, res) => {
  const banner = new Banner(req.body);
  await banner.save();
  res.json(banner);
};

exports.update = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(banner);
};

exports.delete = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
