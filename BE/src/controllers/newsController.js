const News = require('../models/News');

exports.getAll = async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json(news);
};

exports.create = async (req, res) => {
  const now = new Date();
  const item = new News({ ...req.body, updatedAt: now });
  await item.save();
  res.json(item);
};

exports.update = async (req, res) => {
  const now = new Date();
  const item = await News.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: now },
    { new: true }
  );
  res.json(item);
};

exports.delete = async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
