import React from "react";

const FilterSideBar = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onReset, // Hàm reset chung
}) => {
  // Logic xử lý Toggle Category
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Logic xử lý Dual Slider (Range Slider thủ công)
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 10000);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 10000);
    setPriceRange([priceRange[0], value]);
  };

  // Tính toán % để hiển thị thanh màu xanh giữa 2 nút slider
  const minPercent = (priceRange[0] / 500000) * 100;
  const maxPercent = (priceRange[1] / 500000) * 100;

  return (
    <div className="space-y-8 p-4 border rounded-lg bg-white shadow-sm">
      {/* --- Categories --- */}
      <div>
        <h3 className="font-semibold mb-4 text-lg">Danh Mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {/* Custom checkmark icon (optional styling enhancement) */}
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label
                htmlFor={category.id}
                className="text-sm text-gray-700 cursor-pointer select-none group-hover:text-blue-600 transition-colors"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Price Range (Dual Slider Custom) --- */}
      <div>
        <h3 className="font-semibold mb-4 text-lg">Khoảng Giá</h3>

        {/* Slider Container */}
        <div className="relative w-full h-6 mb-4">
          {/* Thanh Background xám */}
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 rounded-full -translate-y-1/2"></div>

          {/* Thanh Active màu xanh */}
          <div
            className="absolute top-1/2 h-1.5 bg-[#F7B5D5] rounded-full -translate-y-1/2 pointer-events-none"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          ></div>

          {/* Input Range Min */}
          <input
            type="range"
            min={0}
            max={500000}
            step={10000}
            value={priceRange[0]}
            onChange={handleMinChange}
            className=" absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer z-10"
          />

          {/* Input Range Max */}
          <input
            type="range"
            min={0}
            max={500000}
            step={10000}
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer z-20"
          />
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {priceRange[0].toLocaleString("vi-VN")}đ
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            {priceRange[1].toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* --- Rating --- */}
      <div>
        <h3 className="font-semibold mb-4 text-lg">Đánh Giá</h3>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              onClick={() => setMinRating(rating === minRating ? 0 : rating)}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                minRating === rating
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < rating ? (
                      "★"
                    ) : (
                      <span className="text-gray-200">★</span>
                    )}
                  </span>
                ))}
              </div>
              <span
                className={`text-sm font-medium ${
                  minRating === rating ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {rating === 5 ? "Tuyệt vời" : `${rating} sao trở lên`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Reset Button --- */}
      <button
        onClick={onReset}
        className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-[0.98] shadow-sm hover:cursor-pointer"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default FilterSideBar;
