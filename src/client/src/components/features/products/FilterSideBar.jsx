const FilterSideBar = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onReset,
}) => {
  const MAX_PRICE = 1000000; // Định nghĩa hằng số để dễ quản lý

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 50000);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 50000);
    setPriceRange([priceRange[0], value]);
  };

  // Tính toán % hiển thị bằng công thức:
  // $$ \text{percent} = \frac{\text{current price}}{\text{MAX\_PRICE}} \times 100 $$
  const minPercent = (priceRange[0] / MAX_PRICE) * 100;
  const maxPercent = (priceRange[1] / MAX_PRICE) * 100;

  return (
    <div className="space-y-8 p-5 border rounded-2xl bg-white shadow-sm border-pink-50">
      {/* --- Categories --- */}
      <div>
        <h3 className="font-bold mb-4 text-lg text-gray-800">Danh Mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => toggleCategory(category._id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#F7B5D5] checked:border-[#F7B5D5] transition-all"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label
                htmlFor={category._id} // SỬA: Dùng _id thay vì id
                className="text-sm text-gray-600 cursor-pointer select-none group-hover:text-[#F7B5D5] transition-colors"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- Price Range --- */}
      <div>
        <h3 className="font-bold mb-4 text-lg text-gray-800">Khoảng Giá</h3>
        <div className="relative w-full h-6 mb-4">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 h-1.5 bg-[#F7B5D5] rounded-full -translate-y-1/2"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          ></div>

          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={10000}
            value={priceRange[0]}
            onChange={handleMinChange}
            className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F7B5D5] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={10000}
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F7B5D5] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs font-bold text-[#F7B5D5]">
          <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
          <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      {/* --- Rating --- */}
      <div>
        <h3 className="font-bold mb-4 text-lg text-gray-800">Đánh Giá</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div
              key={rating}
              onClick={() => setMinRating(rating === minRating ? 0 : rating)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border ${
                minRating === rating
                  ? "bg-pink-50 border-pink-200"
                  : "hover:bg-gray-50 border-transparent"
              }`}
            >
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span
                className={`text-xs font-bold ${
                  minRating === rating ? "text-[#F7B5D5]" : "text-gray-400"
                }`}
              >
                {rating === 5 ? "Tuyệt vời" : `${rating}+ sao`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 bg-pink-50 text-[#F7B5D5] font-bold rounded-xl hover:bg-[#F7B5D5] hover:text-white transition-all shadow-sm active:scale-95"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default FilterSideBar;
