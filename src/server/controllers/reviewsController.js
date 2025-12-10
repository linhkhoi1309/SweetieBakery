import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user._id; // Đảm bảo middleware auth đã chạy trước đó

        // Kiểm tra ID sản phẩm
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
        }

        // Tìm sản phẩm trong DB
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        // Tạo Review
        const review = await Review.create({
            user: userId,
            product: productId,
            rating: Number(rating),
            comment,
            isApproved: true
        });


        // Lấy tất cả review của sản phẩm này để tính trung bình
        const reviews = await Review.find({ product: productId, isApproved: true });
        
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        // Cập nhật vào Product
        product.numReviews = numReviews;
        product.rating = avgRating;
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Đánh giá thành công!',
            data: review
        });

    } catch (error) {
        // Xử lý lỗi trùng lặp 
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đánh giá sản phẩm này rồi.'
            });
        }
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5.2. Lấy đánh giá
export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
        }

        const reviews = await Review.find({ product: productId, isApproved: true })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};