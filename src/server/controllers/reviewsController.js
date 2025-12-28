import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Tính các review có status = 'approved'
const calcAverageRatings = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: stats[0].avgRating,
      numReviews: stats[0].nRating,
    });
  } else {
    // Nếu không còn review nào approved, reset về 0
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};

// 1. Tạo review (Mặc định Pending)
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params; // Đổi thành productId cho rõ ràng
    const userId = req.user._id;

    // Kiểm tra ID sản phẩm
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ" });
    }

    // Kiểm tra điểm đánh giá hợp lệ
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Điểm đánh giá phải từ 1 đến 5 sao.",
      });
    }

    // Kiểm tra nội dung
    if (!comment || comment.trim().length < 5) {
      return res
        .status(400)
        .json({ success: false, message: "Nội dung đánh giá quá ngắn." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // Tạo review (status mặc định là 'pending' từ Schema)
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      message:
        "Gửi đánh giá thành công! Đánh giá sẽ hiển thị sau khi được quản trị viên phê duyệt.",
      data: review,
    });
  } catch (error) {
    // Xử lý lỗi unique index (Mỗi user chỉ đánh giá 1 sản phẩm 1 lần)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã để lại đánh giá cho sản phẩm này rồi.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy Review của sản phẩm (Public - Chỉ lấy Approved)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Tìm review của sản phẩm + đã được duyệt
    const reviews = await Review.find({
      product: productId,
      status: "approved",
    })
      .populate("user", "name avatar") // Lấy info người mua
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lấy tất cả Review (Để quản lý duyệt)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { status } = req.query; // Có thể lọc ?status=pending
    const filter = status ? { status } : {};

    const reviews = await Review.find(filter)
      .populate("user", "name email avatar")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Cập nhật trạng thái (Duyệt/Từ chối)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reviewId = req.params.id;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đánh giá" });
    }

    review.status = status;
    await review.save();

    // Tính lại rating trung bình cho sản phẩm sau khi duyệt/bỏ duyệt
    await calcAverageRatings(review.product);

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái thành ${status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Trả lời Review
export const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đánh giá" });
    }

    review.adminReply = reply;
    review.replyDate = Date.now();
    await review.save();

    res
      .status(200)
      .json({ success: true, message: "Đã gửi phản hồi", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
