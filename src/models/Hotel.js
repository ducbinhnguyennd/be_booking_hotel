import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  tenPhong: String,
  giaTien: Number,
  anhPhong: [String],
});

const HotelSchema = new mongoose.Schema({
  tenKhachSan: String,
  diaChi: String,
  anhKhachSan: [String],
  danhSachPhong: [RoomSchema],
  type: { 
    type: String, 
    enum: ['all', 'popular', 'trending'], // Giới hạn giá trị
    default: 'all' // Mặc định là 'all'
  },
});

export default mongoose.model('Hotel', HotelSchema);