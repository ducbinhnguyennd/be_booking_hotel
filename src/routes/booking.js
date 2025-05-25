import { Router } from 'express';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import { protect } from './auth.js'; // hoặc tách middleware riêng

const router = Router();

router.post('/book', protect, async (req, res) => {
  const { khachSanId, tenPhong, ngayNhan, ngayTra } = req.body;

  try {
    const hotel = await Hotel.findById(khachSanId);
    if (!hotel) return res.status(404).json({ msg: 'Khách sạn không tồn tại' });

    const phong = hotel.danhSachPhong.find(p => p.tenPhong === tenPhong);
    if (!phong) return res.status(404).json({ msg: 'Phòng không tồn tại' });

    const soNgay = Math.ceil((new Date(ngayTra) - new Date(ngayNhan)) / (1000 * 60 * 60 * 24));
    const tongTien = phong.giaTien * soNgay;

    const booking = await Booking.create({
      user: req.user._id,
      khachSan: khachSanId,
      tenPhong,
      ngayNhan,
      ngayTra,
      tongTien,
    });

    res.status(201).json({ msg: 'Đặt phòng thành công', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server khi đặt phòng' });
  }
});

export default router;
