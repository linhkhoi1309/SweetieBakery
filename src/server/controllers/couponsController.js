import Coupon from '../models/Coupon.js';

//Kiểm tra & Áp dụng mã giảm giá
export const applyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        //Validate Input
        if (!code || !cartTotal) {
        return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng cung cấp mã giảm giá và tổng tiền đơn hàng.' 
        });
        }

        // Tìm mã trong DB
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        // Kiểm tra hợp lệ
        if (!coupon) {
        return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại.' });
        }

        if (!coupon.isActive) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã bị khóa.' });
        }

        if (new Date() > coupon.expirationDate) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết hạn.' });
        }

        if (cartTotal < coupon.minPurchase) {
        return res.status(400).json({ 
            success: false, 
            message: `Đơn hàng phải từ ${coupon.minPurchase.toLocaleString('vi-VN')}đ để sử dụng mã này.` 
        });
        }
        
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' });
        }

        // Tính toán số tiền giảm
        let discountAmount = 0;

        if (coupon.discountType === 'percent') {
        discountAmount = (cartTotal * coupon.discountAmount) / 100;
        
        } else {
        // Giảm cố định 
        discountAmount = coupon.discountAmount;
        }

        // Đảm bảo tiền giảm không lớn hơn tổng đơn hàng
        if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
        }

        const newTotal = cartTotal - discountAmount;

        //Trả về kết quả
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


// POST /coupons
export const createCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        const savedCoupon = await newCoupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        res.status(500).json(error);
    }
};