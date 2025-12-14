import { Star, User } from "lucide-react";

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
                {product.category}
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
                <p className="text-gray-500 italic text-center py-4">
                  Chưa có đánh giá nào. Hãy là người đầu tiên!
                </p>
              ) : (
                productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-4 pb-6 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 flex items-center justify-center">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.customerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 font-bold text-sm">
                          {review.customerName?.[0] || (
                            <User className="h-5 w-5" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900">
                          {review.customerName}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {/* Nếu có ngày tháng thì hiển thị ở đây */}2 ngày
                          trước
                        </span>
                      </div>

                      {/* Stars Display */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(review.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
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
