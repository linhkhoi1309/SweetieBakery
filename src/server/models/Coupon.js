import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // Tự động: sale50 -> SALE50
    trim: true,
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: {
    type: String, // VD: "Áp dụng cho đơn từ 200k..."
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed'],
    default: 'percent',
  },
  discountValue: {
    type: Number,
    required: true,
  },
  maxDiscountAmount: { 
    type: Number, 
    default: null, // Chỉ dùng khi type là 'percent'. VD: Giảm 10% tối đa 50k
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true, // Ngày bắt đầu hiệu lực
  },
  endDate: {
    type: Date,
    required: true, // Ngày hết hạn
  },
  usageLimit: {
    type: Number,
    default: 100,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);