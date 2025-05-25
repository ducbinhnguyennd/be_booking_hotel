import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  tenPhong: String,
  giaTien: Number,
  anhPhong: [String], // danh sách ảnh
});

const HotelSchema = new mongoose.Schema({
  tenKhachSan: String,
  diaChi: String,
  anhKhachSan: [String],
  danhSachPhong: [RoomSchema],
});

export default mongoose.model('Hotel', HotelSchema);
