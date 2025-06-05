import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  khachSan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  tenPhong: {
    type: String,
    required: true,
  },
  loaiPhong: { 
    type: String, 
    enum: ['Đơn', 'Đôi', 'VIP', 'Suite'], 
  },
  ngayNhan: {
    type: Date,
    required: true,
  },
  ngayTra: {
    type: Date,
    required: true,
  },
  tongTien: {
    type: Number,
    required: true,
  },
  trangThai: {
    type: String,
    enum: ['chờ xác nhận', 'xác nhận', 'hủy'],
    default: 'chờ xác nhận',
  },
});

export default mongoose.model('Booking', BookingSchema);