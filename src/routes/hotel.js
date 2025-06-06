import { Router } from 'express';
import multer from 'multer';
import Hotel from '../models/Hotel.js';
import protect from './auth.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Lấy __dirname trong ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const router = Router();

// // Cấu hình multer để lưu file vào thư mục uploads/
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads')); // Lưu vào thư mục uploads
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (['.jpg', '.jpeg', '.png'].includes(ext)) {
//       cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     } else {
//       cb(new Error('Chỉ hỗ trợ file .jpg hoặc .png'));
//     }
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (['.jpg', '.jpeg', '.png'].includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Chỉ hỗ trợ file .jpg hoặc .png'), false);
//     }
//   },
// });

const storage = multer.memoryStorage() // Lưu vào bộ nhớ
const upload = multer({ storage })

const uploadFields = upload.fields([{ name: 'anhKhachSan', maxCount: 10 }])

// Tạo khách sạn với type
router.post('/create',protect, uploadFields, async (req, res) => {
  try {
    const { tenKhachSan, diaChi, danhSachPhong, type } = req.body

    if (type && !['all', 'popular', 'trending'].includes(type)) {
      return res.status(400).json({ msg: 'Loại khách sạn không hợp lệ' })
    }

    const dsPhong = JSON.parse(danhSachPhong)

    // Convert file ảnh sang base64
    const anhKhachSan = (req.files['anhKhachSan'] || []).map(file => {
      const base64 = file.buffer.toString('base64')
      const mimeType = file.mimetype
      return `data:${mimeType};base64,${base64}`
    })

    const hotel = await Hotel.create({
      tenKhachSan,
      diaChi,
      anhKhachSan, // Lưu chuỗi base64
      danhSachPhong: dsPhong,
      type: type || 'all'
    })

    res.status(201).json({ msg: 'Tạo khách sạn thành công', hotel })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Lỗi khi tạo khách sạn' })
  }
})



// Lấy danh sách khách sạn với bộ lọc theo type
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query;
    let hotels;

    if (filter && ['all', 'popular', 'trending'].includes(filter)) {
      hotels = await Hotel.find({ type: filter });
    } else {
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


router.delete('/hotel/clear', async (req, res) => {
  try {
    const result = await Hotel.deleteMany({})
    res.json({
      msg: 'Đã xóa toàn bộ booking',
      deletedCount: result.deletedCount
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Lỗi khi xóa booking' })
  }
})

export default router;