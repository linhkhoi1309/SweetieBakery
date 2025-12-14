import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { MOCK_FEATURED_PRODUCTS as mockProducts } from "../../../data/mockHomePageData.js";

// Import API helper nếu có
// import { http } from "../../../libs/http";

const ProductList = ({
  searchQuery,
  selectedCategories,
  priceRange,
  minRating,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = 6; // Số sản phẩm trên mỗi trang

  // --- LOGIC 1: REAL API QUERY STRING CONSTRUCTION (Commented Out for Future Use) ---
  /*
  const apiQueryString = useMemo(() => {
    const p = new URLSearchParams();
    
    // Filter params
    if (selectedCategories.length > 0) p.set("categories", selectedCategories.join(","));
    if (priceRange) {
        p.set("minPrice", priceRange[0]);
        p.set("maxPrice", priceRange[1]);
    }
    if (minRating > 0) p.set("minRating", minRating);
    if (searchQuery) p.set("q", searchQuery);

    // Pagination params
    p.set("page", currentPage);
    p.set("limit", itemsPerPage);

    return p.toString();
  }, [selectedCategories, priceRange, minRating, searchQuery, currentPage]);
  */

  // --- LOGIC 2: FETCH DATA & FILTER (Switchable) ---
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // --- OPTION A: REAL API CALL (Future Use) ---
        /*
        const res = await http.get(`/products?${apiQueryString}`);
        if (isMounted) {
          setProducts(res.data.data);
          setTotalPages(res.data.pages);
        }
        */

        // --- OPTION B: MOCK DATA PROCESSING (Current Use) ---
        // Giả lập delay mạng
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 1. Filter logic (Client-side filtering cho mock data)
        let filtered = mockProducts.filter((product) => {
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category); // Đảm bảo field 'category' trong mockData khớp

          const matchesPrice =
            product.price >= priceRange[0] && product.price <= priceRange[1];

          const matchesRating = product.rating >= minRating;

          return (
            matchesSearch && matchesCategory && matchesPrice && matchesRating
          );
        });

        // 2. Pagination logic (Client-side pagination cho mock data)
        const totalItems = filtered.length;
        const totalPagesCalc = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filtered.slice(startIndex, endIndex);

        if (isMounted) {
          setProducts(paginatedProducts);
          setTotalPages(totalPagesCalc || 1);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        if (isMounted) setError("Không thể tải danh sách sản phẩm.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategories, priceRange, minRating, currentPage]); // Dependency array bao gồm tất cả filter states

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", newPage);
    setSearchParams(nextParams);

    // Scroll lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[300px] w-full bg-gray-200 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Meta Info */}
      <div className="mb-4 text-sm text-muted-foreground">
        {/* Note: Với API thật, số lượng này nên lấy từ res.data.total */}
        Hiển thị {products.length} sản phẩm (Trang {currentPage}/{totalPages})
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Không tìm thấy sản phẩm phù hợp
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 border rounded flex items-center justify-center transition-colors
                    ${
                      currentPage === page
                        ? "bg-[#F7B5D5] text-white "
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
