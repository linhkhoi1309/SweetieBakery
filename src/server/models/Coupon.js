import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // Tự động in hoa: SALE50
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed'], // Giảm theo % hoặc số tiền cố định
    default: 'percent',
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minOrderValue: { // Giá trị đơn tối thiểu để áp dụng
    type: Number,
    default: 0,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  maxUsage: { // Số lượt dùng tối đa
    type: Number,
    default: 100,
  },
  usedCount: { // Số lượt đã dùng
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);