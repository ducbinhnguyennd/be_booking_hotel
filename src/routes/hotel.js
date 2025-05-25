import { Router } from 'express';
import multer from 'multer';
import Hotel from '../models/Hotel.js';
import { protect } from './auth.js'; // hoặc tách riêng middleware xác thực nếu cần

const router = Router();

// Cấu hình lưu ảnh tạm trong RAM (có thể cấu hình lưu file nếu muốn)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Thêm khách sạn mới
router.post('/create', protect, upload.none(), async (req, res) => {
  try {
    const { tenKhachSan, diaChi, anhKhachSan, danhSachPhong } = req.body;

    // Parse chuỗi JSON từ client gửi (nếu là chuỗi)
    const dsPhong = JSON.parse(danhSachPhong); // mảng phòng
    const anh = JSON.parse(anhKhachSan);       // mảng URL ảnh khách sạn

    const hotel = await Hotel.create({
      tenKhachSan,
      diaChi,
      anhKhachSan: anh,
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
