import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: { 
    type: String, 
    slug: 'name', // Dùng để tạo URL thân thiện: /products/banh-kem-dau
    unique: true 
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  priceSale: { // Giá khuyến mãi (nếu có)
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: { type: String, required: true }, // ID trên Cloudinary
      url: { type: String, required: true },
    }
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Liên kết bảng Category
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  sold: { // Đếm số lượng đã bán (để hiển thị "Best Seller")
    type: Number,
    default: 0,
  },
  rating: { // Điểm đánh giá trung bình (Cache từ bảng Reviews)
    type: Number,
    default: 0,
  },
  numReviews: { // Tổng số đánh giá
    type: Number,
    default: 0,
  },
  isDeleted: { // Soft delete (FR-A.1)
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Tạo text index để hỗ trợ tìm kiếm (FR-U.1)
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);