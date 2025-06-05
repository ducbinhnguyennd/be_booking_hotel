import { Router } from 'express';
import { hash as _hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import protect from './auth.js';

const router = Router();
const upload = multer();
const { sign } = jwt;

// Đăng ký
router.post('/register', upload.none(), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Vui lòng nhập đầy đủ thông tin' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email đã tồn tại' });
    }

    const hash = await _hash(password, 12);
    const user = await User.create({ name, email, password: hash });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Đăng nhập
router.post('/login', upload.none(), async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Sai tài khoản' });

    const match = await compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Sai mật khẩu' });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Lấy thông tin user theo ID
router.get('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

export default router;
