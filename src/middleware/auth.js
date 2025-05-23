import { verify } from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer xxx"
  if (!token) return res.status(401).json({ msg: 'Không có token' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};
