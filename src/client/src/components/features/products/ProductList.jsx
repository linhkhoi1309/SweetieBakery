import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import ProductCard from "./ProductCard";
import { http } from "../../../libs/http";

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
  const [totalItems, setTotalItems] = useState(0);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = 6;

  // --- XÂY DỰNG QUERY STRING  ---
  const apiQueryString = useMemo(() => {
    const p = new URLSearchParams();

    if (searchQuery) p.set("keyword", searchQuery);

    if (selectedCategories.length > 0) {
      p.set("category", selectedCategories[0]);
    }

    if (priceRange) {
      p.set("priceGte", priceRange[0]);
      p.set("priceLte", priceRange[1]);
    }

    p.set("page", currentPage);
    p.set("limit", itemsPerPage);

    return p.toString();
  }, [selectedCategories, priceRange, searchQuery, currentPage]);

  // --- GỌI API ---
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await http.get(`/products?${apiQueryString}`);

        if (isMounted) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.totalPage || 1);
          setTotalItems(res.data.totalItems || 0);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message || "Không thể tải danh sách sản phẩm."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [apiQueryString]);

  // --- XỬ LÝ CHUYỂN TRANG ---
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", newPage);
    setSearchParams(nextParams);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[350px] w-full bg-pink-50/30 animate-pulse rounded-2xl border border-pink-100 flex items-center justify-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-[#F7B5D5]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-red-100 rounded-3xl bg-red-50/50">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-2 bg-white border border-red-200 rounded-full text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Thông tin số lượng */}
      <div className="mb-6 flex justify-between items-center text-sm font-medium">
        <p className="text-gray-500">
          Tìm thấy{" "}
          <span className="text-[#F7B5D5] font-bold">{totalItems}</span> loại
          bánh 🧁
        </p>
        <div className="px-3 py-1 bg-pink-50 text-[#F7B5D5] rounded-full">
          Trang {currentPage} / {totalPages}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-xl font-medium">
            Hiện chưa có loại bánh bạn tìm kiếm...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Hãy thử thay đổi bộ lọc hoặc từ khóa khác nhé!
          </p>
        </div>
      ) : (
        <>
          {/* hiển thị sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Điều khiển phân trang */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2 rounded-2xl border border-pink-100 bg-white text-gray-500 hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
              >
                Trước
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-11 h-11 rounded-2xl border transition-all font-bold text-sm
                    ${
                      currentPage === page
                        ? "bg-[#F7B5D5] text-white border-[#F7B5D5] shadow-lg shadow-pink-100 scale-110"
                        : "bg-white border-pink-100 text-gray-400 hover:border-[#F7B5D5] hover:text-[#F7B5D5]"
                    }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2 rounded-2xl border border-pink-100 bg-white text-gray-500 hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
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
