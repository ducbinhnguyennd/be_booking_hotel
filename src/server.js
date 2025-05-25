import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'               ;
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import hotelRoutes from './routes/hotel.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/hotel', hotelRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('✅ Server running on port 5000'));
  })
  .catch(err => console.log('❌ MongoDB connect error:', err));
