import { X } from "lucide-react";
import FilterSideBar from "./FilterSideBar";

const MobileFilterMenu = ({ isOpen, onClose, ...filterProps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 1. Overlay (Lớp nền đen) */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0"
        onClick={onClose} // Bấm ra ngoài thì đóng
      />

      {/* 2. Content Panel (Khung trượt) */}
      <div
        className="
          fixed z-50 flex flex-col bg-background shadow-lg transition ease-in-out 
          inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm bg-white
          animate-in slide-in-from-right duration-300
        "
      >
        {/* Header: Title + Close Button */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>

          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-1"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body: Gọi lại FilterSideBar ở đây */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Truyền tất cả props (categories, selectedCategories...) vào đây */}
          <FilterSideBar {...filterProps} />
        </div>

        {/* Footer (Optional): Nút xem kết quả */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#F7B5D5] text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Xem kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterMenu;
