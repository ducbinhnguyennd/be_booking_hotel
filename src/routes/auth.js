// middleware/protect.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'Người dùng không tồn tại' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Lỗi xác thực JWT:', err);
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};

export default protect;
