const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.json({ success: false, message: 'Tài khoản không tồn tại!' });
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.json({ success: false, message: 'Sai mật khẩu!' });
  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ success: true, token });
};

exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hash });
  await admin.save();
  res.json({ success: true });
};
