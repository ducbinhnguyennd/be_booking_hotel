import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  tenPhong: { type: String, required: true },
  giaTien: { type: Number, required: true },
  loaiPhong: { 
    type: String, 
    enum: ['Đơn', 'Đôi', 'VIP', 'Suite'], 
    default: 'Đơn' 
  }, // Thêm loại phòng
  anhPhong: [String],
});

const HotelSchema = new mongoose.Schema({
  tenKhachSan: { type: String, required: true },
  diaChi: { type: String, required: true },
  anhKhachSan: [{ type: String }], // Mảng đường dẫn ảnh
  danhSachPhong: [RoomSchema],
  type: { 
    type: String, 
    enum: ['all', 'popular', 'trending'],
    default: 'all'
  },
});

export default mongoose.model('Hotel', HotelSchema);