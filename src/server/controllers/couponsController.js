import Coupon from "../models/Coupon.js";

//USER

// Endpoint: POST /coupons/apply
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!orderValue) {
      return res
        .status(400)
        .json({ success: false, message: "Cần cung cấp giá trị đơn hàng." });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // Kiểm tra tồn tại
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Mã giảm giá không tồn tại." });
    }

    // Kiểm tra trạng thái kích hoạt
    if (!coupon.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Mã giảm giá hiện đang bị khóa." });
    }

    // Kiểm tra số lượng sử dụng
    if (coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng." });
    }

    // Kiểm tra thời gian (Start & End)
    const now = new Date();
    if (now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "Chương trình khuyến mãi chưa bắt đầu.",
      });
    }
    if (now > coupon.endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Mã giảm giá đã hết hạn." });
    }

    // Kiểm tra giá trị đơn tối thiểu
    if (orderValue < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString(
          "vi-VN"
        )}đ mới được áp dụng.`,
      });
    }

    // Tính toán số tiền giảm
    let discountAmount = 0;

    if (coupon.discountType === "percent") {
      discountAmount = (orderValue * coupon.discountValue) / 100;
      // Kiểm tra mức giảm tối đa
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Không giảm quá giá trị đơn hàng
    if (discountAmount > orderValue) {
      discountAmount = orderValue;
    }

    const newTotal = orderValue - discountAmount;

    res.status(200).json({
      success: true,
      data: {
        // couponCode: coupon.code,
        // discountType: coupon.discountType,
        // discountAmount: discountAmount,
        // newTotal: newTotal,
        ...coupon._doc, // Trả toàn bộ
        discountAmount: discountAmount,
        message: "Áp dụng mã giảm giá thành công!",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADMIN

// POST /coupons (Tạo mới)
export const createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Mã khuyến mãi này đã tồn tại." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /coupons (Lấy danh sách cho Dashboard)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    const now = new Date();
    const formattedCoupons = coupons.map((coupon) => {
      let status = "active";
      if (!coupon.isActive) status = "disabled"; // Admin tắt
      else if (now > coupon.endDate) status = "expired"; // Hết hạn
      else if (coupon.usedCount >= coupon.usageLimit)
        status = "sold_out"; // Hết lượt
      else if (now < coupon.startDate) status = "upcoming"; // Chưa đến giờ

      return {
        ...coupon._doc,
        displayStatus: status,
      };
    });

    res
      .status(200)
      .json({ success: true, count: coupons.length, data: formattedCoupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /coupons/:id (Cập nhật)
export const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy mã giảm giá." });
    }

    res.status(200).json({ success: true, data: updatedCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /coupons/:id (Xóa)
export const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy mã giảm giá." });
    }
    res.status(200).json({ success: true, message: "Đã xóa mã giảm giá." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm hàm này vào controller
export const getPublicCoupons = async (req, res) => {
  try {
    const now = new Date();
    // Lọc: Đang kích hoạt + Trong thời gian hiệu lực + Còn lượt sử dụng
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    })
      .select(
        "code name description discountType discountValue minOrderValue maxDiscountAmount"
      ) // Chỉ lấy field cần thiết
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách khuyến mãi public",
    });
  }
};
