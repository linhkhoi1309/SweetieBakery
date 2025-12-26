import { Link } from "react-router-dom";
import { useState } from "react";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";

const validVouchers = [
  { code: "NEW20", discount: 0.2, description: "Giảm 20%" },
  { code: "FREESHIP", discount: 30000, description: "Miễn phí ship" },
  { code: "GIFT2", discount: 0.1, description: "Giảm 10%" },
];

const CartPage = () => {
  const { totalItems, cart, removeFromCart, updateQuantity, totalPrice } =
    useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState({
    code: "",
    discount: 0,
  });

  const handleApplyVoucher = () => {
    const voucher = validVouchers.find(
      (v) => v.code.toUpperCase() === voucherCode.toUpperCase()
    );

    if (voucher) {
      setAppliedVoucher(voucher);
      toast.success(
        `Áp dụng mã ${voucher.code} thành công! ${voucher.description}`
      );
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    toast.info("Đã xóa mã giảm giá");
  };

  const subtotal = totalPrice;
  const shippingFee = 30000;

  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === "FREESHIP") {
      discount = shippingFee;
    } else {
      discount = subtotal * appliedVoucher.discount;
    }
  }

  const total =
    subtotal +
    (appliedVoucher?.code === "FREESHIP" ? 0 : shippingFee) -
    (appliedVoucher?.code === "FREESHIP" ? 0 : discount);

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white text-gray-900 flex flex-col rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-16 flex flex-col items-center justify-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mb-4" />

            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Giỏ hàng trống
            </h2>

            <p className="text-gray-500 mb-6 text-center">
              Hãy thêm sản phẩm vào giỏ hàng của bạn để thưởng thức hương vị
              ngọt ngào.
            </p>

            <Link to="/products">
              <Button className="bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 text-white px-8 py-2 rounded-full transition-all hover:cursor-pointer ">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-8">Giỏ Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedFlavor}`}
              className="mb-4 bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex gap-4 sm:gap-6">
                  {/* Phần hình ảnh sản phẩm */}
                  <div className="w-24 h-24 shrink-0 relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl border border-pink-50"
                    />
                  </div>

                  {/* Phần thông tin chi tiết */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                          {item.name}
                        </h3>

                        <div className="space-y-0.5">
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <span className="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
                              Kích thước:{" "}
                              <span className="font-medium ml-1 text-gray-700">
                                {item.selectedSize}
                              </span>
                            </p>
                          )}
                          {item.selectedFlavor && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2"></span>
                              Hương vị:{" "}
                              <span className="font-medium ml-1 text-gray-700">
                                {item.selectedFlavor}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nút xóa sản phẩm */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors hover:cursor-pointer"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Bộ điều khiển số lượng và Giá tiền */}
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="px-4 font-semibold text-gray-700 min-w-10 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {item.quantity > 1
                            ? `${item.price.toLocaleString("vi-VN")}đ/cái`
                            : ""}
                        </p>
                        <p className="text-xl font-bold text-[#F7B5D5]">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-4xl border-2 border-pink-50 shadow-xl shadow-pink-100/50 overflow-hidden">
            {/* Header trang trí */}
            <div className="bg-[#F7B5D5]/10 py-4 px-6 border-b border-pink-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#F7B5D5] rounded-full"></span>
                Tóm Tắt Đơn Hàng
              </h3>
            </div>

            <div className="p-6">
              {/* Chi tiết giá tiền */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium">Tạm tính</span>
                  <span className="font-semibold text-gray-800">
                    {subtotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium">Phí vận chuyển</span>
                  <span
                    className={`${
                      appliedVoucher?.code === "FREESHIP"
                        ? "text-green-500 font-bold"
                        : "font-semibold text-gray-800"
                    }`}
                  >
                    {appliedVoucher?.code === "FREESHIP"
                      ? "Miễn phí"
                      : "30,000đ"}
                  </span>
                </div>

                {appliedVoucher &&
                  appliedVoucher.code !== "" &&
                  appliedVoucher.code !== "FREESHIP" && (
                    <div className="flex justify-between items-center text-gray-600 animate-in fade-in slide-in-from-top-1">
                      <span className="font-medium italic text-pink-500">
                        Giảm giá ({appliedVoucher.description})
                      </span>
                      <span className="font-semibold text-red-500">
                        -{discount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                {/* -------------------------------------- */}
                <div className="h-px bg-linear-to-r from-transparent via-pink-100 to-transparent my-4" />

                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-800">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-[#F7B5D5] leading-none">
                      {total.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      Đã bao gồm VAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Nhập Voucher */}
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label
                  htmlFor="voucher"
                  className="block text-sm font-bold text-gray-700 mb-2 ml-1"
                >
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    id="voucher"
                    type="text"
                    placeholder="Nhập mã..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-[#F7B5D5] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    disabled={appliedVoucher !== null || !voucherCode}
                    className="px-4 py-2 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Hiển thị Voucher đã áp dụng */}
                {appliedVoucher && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-green-700 uppercase">
                        {appliedVoucher.code}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-xs font-bold text-red-400 hover:text-red-600 underline decoration-2 underline-offset-2"
                    >
                      Gỡ bỏ
                    </button>
                  </div>
                )}
              </div>

              {/* Nhóm nút bấm */}
              <div className="space-y-3">
                <Link to="/checkout">
                  <button className="w-full py-4 bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 transition-all active:scale-[0.98] hover:cursor-pointer">
                    Tiến hành thanh toán
                  </button>
                </Link>

                <Link to="/products">
                  <button className="w-full py-3 bg-white text-gray-500 hover:text-[#F7B5D5] rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 hover:cursor-pointer">
                    <span>←</span> Tiếp tục mua sắm
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
