import { Router } from 'express';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import protect from './auth.js';

const router = Router();

router.post('/book',protect,  async (req, res) => {
  const { khachSanId, tenPhong, ngayNhan, ngayTra } = req.body;
  console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  try {
    const hotel = await Hotel.findById(khachSanId);
    if (!hotel) return res.status(404).json({ msg: 'Khách sạn không tồn tại' });

    const phong = hotel.danhSachPhong.find(p => p.tenPhong === tenPhong);
    if (!phong) return res.status(404).json({ msg: 'Phòng không tồn tại' });

    const soNgay = Math.ceil(
      (new Date(ngayTra) - new Date(ngayNhan)) / (1000 * 60 * 60 * 24)
    );
    console.log('phong:', phong.giaTien);
    const tongTien = phong.giaTien * soNgay;

    const booking = await Booking.create({
      user: req.user._id,
      khachSan: khachSanId,
      tenPhong,
      loaiPhong: phong.loaiPhong, // Lưu loại phòng
      ngayNhan,
      ngayTra,
      tongTien,
      trangThai: 'chờ xác nhận',
    });

    res.status(201).json({ msg: 'Đặt phòng thành công', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server khi đặt phòng' });
  }
});

router.get('/bookings', protect, async (req, res) => {
  try {
    const { trangThai } = req.query
    const query = { user: req.user._id }
    if (trangThai) {
      query.trangThai = trangThai
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'khachSan',
        select: 'tenKhachSan anhKhachSan'
      })
      .sort({ ngayNhan: -1 })

    // Lấy ảnh đầu tiên của khách sạn
    const processed = bookings.map(b => {
      const khachSan = b.khachSan
        ? {
            _id: b.khachSan._id,
            tenKhachSan: b.khachSan.tenKhachSan,
            anhKhachSan: [b.khachSan.anhKhachSan?.[0]] || null
          }
        : null

      return {
        ...b.toObject(),
        khachSan
      }
    })

    res.json(processed)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ msg: 'Lỗi khi lấy danh sách' })
  }
})


router.put('/bookings/:id/cancel',protect,  async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { trangThai: 'hủy' },
      { new: true }
    ).populate({
      path: 'khachSan',
      select: 'tenKhachSan anhKhachSan',
    });
    if (!booking) return res.status(404).json({ msg: 'Không tìm thấy' });
    res.json({ msg: 'Hủy thành công', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi hủy đặt' });
  }
});

export default router;