import { Link } from "react-router-dom";
import { PackageX } from "lucide-react";

const ProductNotFound = () => {
  return (
    <div className="container mx-auto px-4 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        {/* Icon minh họa */}
        <div className="relative flex justify-center">
          <div className="bg-gray-50 p-6 rounded-full ring-1 ring-gray-100 shadow-sm animate-in zoom-in-50 duration-300">
            <PackageX className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        {/* Nội dung thông báo */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-500 max-w-xs mx-auto">
            Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không tồn
            tại.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F7B5D5] px-8 text-sm font-medium text-white shadow-md transition-all hover:bg-[#F7B5D5]/90 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B5D5]"
        >
          Quay lại danh mục
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
