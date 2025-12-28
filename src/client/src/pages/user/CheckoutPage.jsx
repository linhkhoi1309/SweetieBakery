import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, CreditCard, Loader2, MapPin, Package } from "lucide-react";

import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import { useCart } from "../../context/CartContext";
import { http } from "../../libs/http";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cart, clearCart, shippingFee, discount, finalTotal, appliedVoucher } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false); // State loading
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
    notes: "",
  });

  const steps = [
    { number: 1, title: "Thông tin", icon: MapPin },
    { number: 2, title: "Giao hàng", icon: Package },
    { number: 3, title: "Xác nhận", icon: CreditCard },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.address) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi lên (Payload)
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id, // ID sản phẩm từ MongoDB
          quantity: item.quantity,
        })),

        shippingAddress: {
          recipientName: formData.name, // Chuyển từ 'name' sang 'recipientName'
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
        },

        paymentMethod: formData.paymentMethod === "cod" ? "COD" : "Online",

        shippingPrice: shippingFee,
        discountAmount: discount, // Lấy từ CartContext
        totalPrice: finalTotal, // Tổng tiền cuối cùng
        couponCode: appliedVoucher ? appliedVoucher.code : null,
      };

      // Gọi API POST /orders
      const res = await http.post("/orders", orderData);

      console.log("Da tra ve du lieu thanh cong");

      // Xử lý kết quả trả về
      if (res.data.success) {
        toast.success(res.data.message || "Đặt hàng thành công! 🎉");

        // Xóa giỏ hàng trong LocalStorage và Context
        clearCart();

        // Chuyển hướng sang trang theo dõi đơn hàng
        navigate(`/order-tracking/${res.data.data._id}`);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);

      const errorMessage =
        error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-8">Thanh Toán</h1>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step >= s.number;
            const isCurrent = step === s.number;

            return (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive
                        ? "bg-[#F7B5D5] border-[#F7B5D5] text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > s.number ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      step > s.number ? "bg-[#F7B5D5]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-4xl border-2 border-pink-50 shadow-xl shadow-pink-100/50 overflow-hidden transition-all duration-500">
            {/* Header trang trí cho Form */}
            <div className="bg-[#F7B5D5]/5 py-6 px-8 border-b border-pink-50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 1 && "Thông Tin Giao Hàng"}
                {step === 2 && "Phương Thức Giao Hàng"}
                {step === 3 && "Xác Nhận Đơn Hàng"}
              </h2>
              <div className="flex gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    step >= 1 ? "bg-[#F7B5D5]" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-3 h-3 rounded-full ${
                    step >= 2 ? "bg-[#F7B5D5]" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-3 h-3 rounded-full ${
                    step >= 3 ? "bg-[#F7B5D5]" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Nhập thông tin  */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-bold text-gray-700 ml-1"
                      >
                        Họ và tên *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-bold text-gray-700 ml-1"
                      >
                        Số điện thoại *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="0901xxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-bold text-gray-700 ml-1"
                    >
                      Email (Không bắt buộc)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="cake@sweetiebakery.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-bold text-gray-700 ml-1"
                    >
                      Địa chỉ giao hàng *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Số nhà, tên đường..."
                      value={formData.address}
                      onChange={handleInputChange}
                      className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="district"
                        className="text-sm font-bold text-gray-700 ml-1"
                      >
                        Quận/Huyện
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-sm font-bold text-gray-700 ml-1"
                      >
                        Thành phố
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="rounded-xl border-pink-100 focus:ring-[#F7B5D5] h-11"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full h-14 bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-100 transition-all active:scale-[0.98] mt-4"
                  >
                    Tiếp tục đến giao hàng
                  </button>
                </div>
              )}

              {/* Chọn phương thức giao hàng */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <RadioGroup
                    value={formData.shippingMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shippingMethod: value })
                    }
                  >
                    <div className="space-y-4">
                      {[
                        {
                          id: "standard",
                          label: "Giao hàng tiêu chuẩn",
                          time: "3-5 ngày làm việc",
                          price: "30,000đ",
                        },
                        {
                          id: "express",
                          label: "Giao hàng nhanh",
                          time: "1-2 ngày làm việc",
                          price: "50,000đ",
                        },
                        {
                          id: "same-day",
                          label: "Giao trong ngày",
                          time: "Giao trong vòng 4 giờ",
                          price: "80,000đ",
                        },
                      ].map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center space-x-4 border-2 rounded-2xl p-5 transition-all cursor-pointer ${
                            formData.shippingMethod === method.id
                              ? "border-[#F7B5D5] bg-pink-50/30"
                              : "border-gray-50 hover:border-pink-100"
                          }`}
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="text-[#F7B5D5]"
                          />
                          <Label
                            htmlFor={method.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-bold text-gray-800">
                                  {method.label}
                                </p>
                                <p className="text-xs text-gray-500 italic mt-0.5">
                                  {method.time}
                                </p>
                              </div>
                              <span className="font-bold text-[#F7B5D5] bg-white px-3 py-1 rounded-lg border border-pink-100 shadow-sm">
                                {method.price}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border-2 border-pink-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:cursor-pointer"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-4 bg-[#F7B5D5] text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-[#f39cb4] transition-all"
                    >
                      Xác nhận thông tin
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-dashed border-pink-200">
                      <h3 className="text-sm font-black text-[#F7B5D5] uppercase tracking-widest mb-3 italic">
                        Người nhận
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-bold text-lg">{formData.name}</p>
                        <p className="text-sm flex items-center gap-2">
                          📞 {formData.phone}
                        </p>
                        <p className="text-sm flex items-start gap-2 pt-1">
                          📍 {formData.address}, {formData.district},{" "}
                          {formData.city}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-dashed border-pink-200">
                      <h3 className="text-sm font-black text-[#F7B5D5] uppercase tracking-widest mb-3 italic">
                        Vận chuyển
                      </h3>
                      <p className="font-bold text-gray-700">
                        {formData.shippingMethod === "standard" &&
                          "🚚 Giao hàng tiêu chuẩn"}
                        {formData.shippingMethod === "express" &&
                          "⚡ Giao hàng nhanh"}
                        {formData.shippingMethod === "same-day" &&
                          "🚀 Giao trong ngày"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 italic">
                        Dự kiến nhận hàng trong thời gian sớm nhất
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1 italic">
                      Sản phẩm trong giỏ
                    </h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map((item) => (
                        <div
                          key={`${item._id}-${item.selectedSize}-${item.selectedFlavor}`}
                          className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-50 shadow-sm"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              Số lượng: {item.quantity} | {item.selectedSize}
                            </span>
                          </div>
                          <span className="font-bold text-gray-700 italic">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border-2 border-pink-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Thay đổi
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-4 bg-[#F7B5D5] text-white rounded-2xl font-bold text-xl shadow-lg shadow-pink-200 hover:bg-[#f39cb4] transition-all active:scale-[0.98]"
                    >
                      Hoàn tất đặt hàng 🧁
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-4xl border-2 border-pink-50 shadow-xl shadow-pink-100/50 overflow-hidden">
            {/* Header */}
            <div className="bg-[#F7B5D5]/10 py-5 px-6 border-b border-pink-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F7B5D5] rounded-full"></span>
                Tóm Tắt Đơn Hàng
              </h3>
            </div>

            <div className="p-6">
              {/* Phần tính toán chi tiết */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Tạm tính</span>
                  <span className="text-gray-800 font-semibold">
                    {(finalTotal - shippingFee).toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">
                    Phí vận chuyển
                  </span>
                  <span
                    className={
                      shippingFee === 0
                        ? "text-green-500 font-bold"
                        : "text-gray-800 font-semibold"
                    }
                  >
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>

                {/* Đường kẻ phân cách */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-pink-200"></div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-800">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-[#F7B5D5] leading-none">
                      {finalTotal.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1 block">
                      Đã bao gồm VAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Phần ghi chú dịch vụ */}
              <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-[10px]">
                    💵
                  </div>
                  <p>Thanh toán khi nhận hàng (COD)</p>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-[10px]">
                    🔍
                  </div>
                  <p>Kiểm tra hàng trước khi thanh toán</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Xác nhận đặt hàng"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
