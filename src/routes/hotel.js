import { Router } from 'express';
import multer from 'multer';
import Hotel from '../models/Hotel.js';
import protect from './auth.js';

const router = Router();

// Cấu hình lưu ảnh tạm trong RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'anhKhachSan', maxCount: 10 },
]);

// Tạo khách sạn với type
router.post('/create', protect, uploadFields, async (req, res) => {
  try {
    const { tenKhachSan, diaChi, danhSachPhong, type } = req.body;

    // Kiểm tra type hợp lệ
    if (type && !['all', 'popular', 'trending'].includes(type)) {
      return res.status(400).json({ msg: 'Loại khách sạn không hợp lệ' });
    }

    // Parse danh sách phòng từ JSON string
    const dsPhong = JSON.parse(danhSachPhong);

    // Xử lý ảnh khách sạn từ file
    const anhKhachSan = (req.files['anhKhachSan'] || []).map(file => {
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    });

    const hotel = await Hotel.create({
      tenKhachSan,
      diaChi,
      anhKhachSan,
      danhSachPhong: dsPhong,
      type: type || 'all', // Mặc định là 'all' nếu không truyền type
    });

    res.status(201).json({ msg: 'Tạo khách sạn thành công', hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi tạo khách sạn' });
  }
});

// Lấy danh sách khách sạn với bộ lọc theo type
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query; // Lấy query parameter filter
    let hotels;

    if (filter && ['all', 'popular', 'trending'].includes(filter)) {
      // Lọc khách sạn theo type
      hotels = await Hotel.find({ type: filter });
    } else {
      // Mặc định: Lấy tất cả khách sạn
      hotels = await Hotel.find();
    }

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Lấy chi tiết khách sạn theo ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Không tìm thấy khách sạn' });
    res.status(200).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

export default router;