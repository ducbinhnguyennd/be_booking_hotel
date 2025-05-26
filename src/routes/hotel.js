import { Router } from 'express';
import multer from 'multer';
import Hotel from '../models/Hotel.js';
import protect from './auth.js';

const router = Router();

// Cấu hình lưu ảnh tạm trong RAM (có thể cấu hình lưu file nếu muốn)
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'anhKhachSan', maxCount: 10 }, // tên field trong form-data
]);
router.post('/create', protect, uploadFields, async (req, res) => {
  try {
    const { tenKhachSan, diaChi, danhSachPhong } = req.body;

    // Parse danh sách phòng từ JSON string
    const dsPhong = JSON.parse(danhSachPhong); // [{ tenPhong, giaTien, anhPhong: [] }, ...]

    // Xử lý ảnh khách sạn từ file
    const anhKhachSan = (req.files['anhKhachSan'] || []).map(file => {
      // Dữ liệu base64 (hoặc bạn có thể upload lên Cloudinary, S3, lưu file...)
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    });

    const hotel = await Hotel.create({
      tenKhachSan,
      diaChi,
      anhKhachSan,
      danhSachPhong: dsPhong,
    });

    res.status(201).json({ msg: 'Tạo khách sạn thành công', hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi tạo khách sạn' });
  }
});

// Lấy tất cả khách sạn
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
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
