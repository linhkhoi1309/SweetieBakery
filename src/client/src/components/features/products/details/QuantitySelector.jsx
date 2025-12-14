import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity, maxStock }) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Số Lượng
      </label>

      <div className="flex items-center gap-4">
        <div className="flex items-stretch h-10 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          {/* Nút Giảm (-) */}
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className={`
              p-2 w-10 text-gray-500 transition-colors duration-150 
              hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
              ${quantity <= 1 ? "bg-gray-50" : "bg-white"}
            `}
          >
            <Minus className="h-4 w-4 mx-auto" />
          </button>

          {/* Giá trị hiện tại */}
          <span className="flex items-center justify-center px-4 font-semibold text-gray-900 bg-white border-l border-r border-gray-200 min-w-16">
            {quantity}
          </span>

          {/* Nút Tăng (+) */}
          <button
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            disabled={quantity >= maxStock}
            className={`
              p-2 w-10 transition-all duration-150 font-medium
              ${
                quantity >= maxStock
                  ? "bg-gray-50 text-gray-400 disabled:cursor-not-allowed opacity-60"
                  : "bg-[#F7B5D5] text-white hover:bg-[#F7B5D5]/90 active:scale-95"
              }
            `}
          >
            <Plus className="h-4 w-4 mx-auto" />
          </button>
        </div>

        {/* Thông tin số lượng có sẵn */}
        <span className="text-sm text-gray-500">
          {maxStock} sản phẩm có sẵn
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;
