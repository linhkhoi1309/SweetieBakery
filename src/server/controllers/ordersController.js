import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export async function createOrder(req, res) {
  const {
    orderItems,
    shippingAddress,
    paymentMethod = "COD",
    shippingPrice = 0,
    discountAmount = 0,
    totalPrice,
    couponCode,
  } = req.body || {};

  if (!Array.isArray(orderItems) || !orderItems.length) {
    return res
      .status(400)
      .json({ success: false, message: "Giỏ hàng trống, không thể tạo đơn" });
  }

  const requiredAddress = ["recipientName", "address", "city", "phone"];
  const hasValidAddress =
    shippingAddress &&
    requiredAddress.every(
      (key) =>
        typeof shippingAddress[key] === "string" && shippingAddress[key].trim()
    );
  if (!hasValidAddress) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin người nhận / địa chỉ giao hàng",
    });
  }

  const parsedShipping = toNumber(shippingPrice, undefined);
  const parsedDiscount = toNumber(discountAmount, 0);
  if (parsedShipping === undefined || parsedShipping < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Phí vận chuyển không hợp lệ" });
  }

  // Dùng giá từ DB để tránh gian lận giá
  try {
    const normalizedItems = [];
    let itemsSubtotal = 0;

    for (const item of orderItems) {
      const { product, quantity } = item || {};

      if (!product || !isValidObjectId(product)) {
        return res.status(400).json({
          success: false,
          message: "Product ID trong giỏ hàng không hợp lệ",
        });
      }

      const qty = toNumber(quantity, undefined);
      if (qty === undefined || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số lượng sản phẩm phải lớn hơn 0",
        });
      }

      const productDoc = await Product.findOne({
        _id: product,
        isDeleted: false,
      });
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: "Một sản phẩm không tồn tại hoặc đã bị xóa",
        });
      }

      if (productDoc.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${productDoc.name} không đủ tồn kho`,
        });
      }

      const priceSnapshot =
        productDoc.priceSale > 0 ? productDoc.priceSale : productDoc.price;
      itemsSubtotal += priceSnapshot * qty;

      normalizedItems.push({
        name: productDoc.name,
        quantity: qty,
        image: (item && item.image) || (productDoc.images?.[0]?.url ?? ""),
        price: priceSnapshot,
        product: productDoc._id,
      });
    }

    const computedTotal = itemsSubtotal + parsedShipping - parsedDiscount;
    const providedTotal = toNumber(totalPrice, computedTotal);

    if (providedTotal !== computedTotal) {
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không khớp, vui lòng thử lại",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress,
      paymentMethod,
      shippingPrice: parsedShipping,
      discountAmount: parsedDiscount,
      totalPrice: computedTotal,
      status: "Pending",
      isPaid: false,
      isDelivered: false,
    });

    await Promise.all(
      normalizedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sold: item.quantity },
        })
      )
    );

    // Cập nhật số lượt dùng của Coupon
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } } // Tăng thêm 1 đơn vị
      );
    }

    res
      .status(201)
      .json({ success: true, message: "Đặt hàng thành công", data: order });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo đơn hàng",
      error: error.message,
    });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message,
    });
  }
}

export async function getOrderById(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "ID đơn hàng không hợp lệ" });
  }

  try {
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const isOwner =
      order.user && order.user._id?.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết đơn hàng",
      error: error.message,
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách tất cả đơn hàng",
      error: error.message,
    });
  }
}

export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "ID đơn hàng không hợp lệ" });
  }

  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipping",
    "Delivered",
    "Cancelled",
  ];
  if (!status || !allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Trạng thái đơn hàng không hợp lệ" });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
}
