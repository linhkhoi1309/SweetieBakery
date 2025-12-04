import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // CHIẾN LƯỢC SNAPSHOT: Lưu cứng thông tin sản phẩm tại thời điểm mua
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true }, // Giá lúc mua (quan trọng!)
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    recipientName: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'COD', // Cash on Delivery (Giai đoạn 1)
  },
  paymentResult: { // Dùng cho Phase 2 khi tích hợp Online Payment
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  // Các loại phí
  shippingPrice: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 }, // Tiền giảm giá từ Coupon
  totalPrice: { type: Number, required: true }, // Tổng tiền phải trả
  
  // Trạng thái đơn hàng (FR-A.2 & FR-U.4)
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);