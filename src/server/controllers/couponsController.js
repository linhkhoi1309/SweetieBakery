import Coupon from '../models/Coupon.js';

// 6.1. Kiểm tra & Áp dụng mã giảm giá
// Endpoint: POST /coupons/apply
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderValue } = req.body;

        if (!orderValue) {
        return res.status(400).json({ success: false, message: 'Cần cung cấp giá trị đơn hàng để tính toán.' });
        }

        // Tìm mã trong DB
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        // Kiểm tra tồn tại
        if (!coupon) {
        return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại.' });
        }

        // Kiểm tra hợp lệ
        if (!coupon.isActive) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đang bị khóa.' });
        }

        if (new Date() > coupon.expirationDate) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết hạn.' });
        }

        if (coupon.usedCount >= coupon.maxUsage) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' });
        }

        // Kiểm tra giá trị đơn tối thiểu
        if (orderValue < coupon.minOrderValue) {
        return res.status(400).json({ 
            success: false, 
            message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString('vi-VN')}đ mới được dùng mã này.` 
        });
        }

        let discountAmount = 0;

        if (coupon.discountType === 'percent') {
        discountAmount = (orderValue * coupon.discountValue) / 100;
        } else {
        discountAmount = coupon.discountValue;
        }

        // Đảm bảo không giảm quá số tiền đơn hàng
        if (discountAmount > orderValue) {
        discountAmount = orderValue;
        }

        const newTotal = orderValue - discountAmount;

        // Trả về kết quả
        res.status(200).json({
        success: true,
        discountAmount: discountAmount,
        newTotal: newTotal,
        couponCode: coupon.code
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

// Endpoint: POST /coupons
    export const createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};