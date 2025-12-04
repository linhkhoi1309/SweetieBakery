import Review from '../models/Review.js';

export const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        
        // Cần đảm bảo isAuth đã gán user vào req
        const userId = req.user._id; 

        const review = await Review.create({
        user: userId,
        product: productId,
        rating: Number(rating),
        comment,
        isApproved: true
        });

        res.status(201).json({
        success: true,
        message: 'Đánh giá thành công!',
        data: review
        });

    } catch (error) {
        if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Bạn đã đánh giá sản phẩm này rồi.'
        });
        }
        res.status(500).json({ success: false, message: error.message });
    }
    };

    // 5.2. Lấy đánh giá
    export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;

        const reviews = await Review.find({ product: productId, isApproved: true }).populate('user', 'name avatar').sort({ createdAt: -1 });

        res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};