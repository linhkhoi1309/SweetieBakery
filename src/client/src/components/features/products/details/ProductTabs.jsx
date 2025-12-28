import { MessageSquare, Star, User } from "lucide-react";

const ProductTabs = ({
  activeTab,
  setActiveTab,
  product,
  productReviews,
  handleSubmitReview,
  rating,
  setRating,
  reviewText,
  setReviewText,
}) => {
  return (
    <div className="w-full">
      {/* --- 1. TAB NAVIGATION (Thay thế TabsList & TabsTrigger) --- */}
      <div className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-500 w-full sm:w-auto">
        {/* Nút Tab: Mô Tả */}
        <button
          onClick={() => setActiveTab("description")}
          className={`
            flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-1.5 text-sm font-medium transition-all focus:outline-none
            ${
              activeTab === "description"
                ? "bg-white text-black shadow-sm" // Active
                : "text-gray-500 hover:text-gray-900" // Inactive
            }
          `}
        >
          Mô Tả Chi Tiết
        </button>

        {/* Nút Tab: Đánh Giá */}
        <button
          onClick={() => setActiveTab("reviews")}
          className={`
            flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-1.5 text-sm font-medium transition-all focus:outline-none
            ${
              activeTab === "reviews"
                ? "bg-white text-black shadow-sm" // Active
                : "text-gray-500 hover:text-gray-900" // Inactive
            }
          `}
        >
          Đánh Giá
        </button>
      </div>

      {/* --- 2. TAB CONTENT --- */}
      <div className="mt-8">
        {/* === NỘI DUNG TAB MÔ TẢ === */}
        {activeTab === "description" && (
          <div className="max-w-2xl animate-in fade-in zoom-in-95 duration-200">
            <p className="leading-relaxed text-gray-700">
              {product.description}
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p>
                <strong className="font-semibold text-gray-900">
                  Danh mục:
                </strong>{" "}
                {product.category?.name || product.category}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">
                  Tồn kho:
                </strong>{" "}
                {product.stock} sản phẩm
              </p>
              {product.sizes && (
                <p>
                  <strong className="font-semibold text-gray-900">
                    Kích thước:
                  </strong>{" "}
                  {product.sizes.join(", ")}
                </p>
              )}
              {product.flavors && (
                <p>
                  <strong className="font-semibold text-gray-900">
                    Hương vị:
                  </strong>{" "}
                  {product.flavors.join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* === NỘI DUNG TAB ĐÁNH GIÁ === */}
        {activeTab === "reviews" && (
          <div className="max-w-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Form Viết Đánh Giá */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Viết Đánh Giá
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Chọn Sao */}
                <div>
                  {/* Thay thế Label */}
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Đánh giá của bạn
                  </label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ô Nhập Liệu (Textarea) */}
                <div>
                  <label
                    htmlFor="review"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nhận xét
                  </label>
                  <textarea
                    id="review"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    required
                    className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B5D5] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Nút Gửi (Button) */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-[#F7B5D5] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#F7B5D5]/90 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#F7B5D5] focus:ring-offset-2"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>

            {/* Đường gạch ngang (Separator) */}
            <hr className="my-8 border-gray-200" />

            {/* Danh sách Đánh Giá */}
            <h3 className="mb-6 text-xl font-bold text-gray-900">
              Đánh Giá Của Khách Hàng ({productReviews.length})
            </h3>

            <div className="space-y-6">
              {productReviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-medium italic">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!
                </div>
              ) : (
                productReviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-6 bg-white rounded-[2rem] border border-pink-50 mb-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-[#F7B5D5]/20 rounded-full flex items-center justify-center font-bold text-[#F7B5D5]">
                          {review.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {review.user?.name}
                          </p>
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed ml-13">
                      {review.comment}
                    </p>

                    {/* Phản hồi của Admin */}
                    {review.adminReply && (
                      <div className="mt-4 ml-13 p-4 bg-pink-50/50 rounded-2xl border-l-4 border-[#F7B5D5]">
                        <p className="text-xs font-black text-[#F7B5D5] uppercase mb-1 flex items-center gap-1">
                          <MessageSquare size={12} /> SweetieBakery phản hồi:
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          {review.adminReply}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
