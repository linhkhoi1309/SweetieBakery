import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { MOCK_CATEGORIES } from "../../data/mockCategories.js";

import FilterSideBar from "../../components/features/products/FilterSideBar";
import MobileFilterMenu from "../../components/features/products/MobileFilterMenu";
import ProductList from "../../components/features/products/ProductList";

const ProductPage = () => {
  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      // Call API
      setCategories(MOCK_CATEGORIES);
    };

    loadCategories();
  }, []);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500000]);
    setMinRating(0);
    setSearchQuery("");
  };

  const filterProps = {
    categories,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    onReset: handleResetFilters,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Danh Mục Sản Phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập bánh ngon của chúng tôi
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        {/* --- Search Input Section --- */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          {/* Input: Style lấy trực tiếp từ input.tsx + pl-10 */}
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-9 w-full min-w-0 rounded-lg bg-pink-300/10 px-3 py-1 text-base shadow-sm md:text-sm pl-10"
          />
        </div>

        {/* --- Filter Button (Mobile) --- */}
        {/* Button Variant Outline Styles inline */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="
          md:hidden
          inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 
          border border-input bg-background hover:bg-accent hover:text-accent-foreground
          h-10 px-4 py-2
        "
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Lọc
        </button>

        <MobileFilterMenu
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          {...filterProps}
        />
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <FilterSideBar {...filterProps} />
          </div>
        </aside>

        {/* --- Products Grid Section --- */}
        <ProductList
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          minRating={minRating}
        />
      </div>
    </div>
  );
};

export default ProductPage;
