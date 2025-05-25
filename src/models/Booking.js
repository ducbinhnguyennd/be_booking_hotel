import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  khachSan: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  tenPhong: String,
  ngayNhan: Date,
  ngayTra: Date,
  tongTien: Number,
  trangThai: { type: String, default: 'chờ xác nhận' },
});

export default mongoose.model('Booking', BookingSchema);
