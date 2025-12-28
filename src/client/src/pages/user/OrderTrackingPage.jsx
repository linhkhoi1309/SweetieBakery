import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { http } from "../../libs/http.js";
import moment from "moment";

const OrderTrackingPage = () => {
  const { id: orderID } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping trạng thái Backend sang UI
  const statusStepMap = {
    Pending: 1, // Chờ xử lý
    Processing: 2, // Đang làm bánh
    Shipping: 3, // Đang giao
    Delivered: 4, // Đã giao
    Cancelled: 0, // Đã hủy
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await http.get(`/orders/${orderID}`);
        setOrder(res.data.data);
      } catch (err) {
        setError("Không tìm thấy đơn hàng này.");
      } finally {
        setIsLoading(false);
      }
    };
    if (orderID) fetchOrder();
  }, [orderID]);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-[#F7B5D5]" />
      </div>
    );

  if (error || !order)
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
        <Link to="/" className="text-[#F7B5D5] underline mt-4 block">
          Quay về trang chủ
        </Link>
      </div>
    );

  const currentStep = statusStepMap[order.status] || 1;
  const isCancelled = order.status === "Cancelled";

  // Định nghĩa các bước hiển thị
  const steps = [
    { id: 1, title: "Đã đặt hàng", icon: Clock, time: order.createdAt },
    { id: 2, title: "Đang chuẩn bị", icon: Package, time: null }, // Có thể thêm trường updatedAt nếu muốn
    { id: 3, title: "Đang giao hàng", icon: Truck, time: null },
    {
      id: 4,
      title: "Giao thành công",
      icon: CheckCircle2,
      time: order.deliveredAt,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-xl border border-pink-50 overflow-hidden">
        {/* Header */}
        <div className="bg-[#F7B5D5]/10 p-6 border-b border-pink-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Mã đơn hàng</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              #{order._id.slice(-6).toUpperCase()}
            </h1>
          </div>
          <div
            className={`px-4 py-1 rounded-full text-sm font-bold ${
              isCancelled
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isCancelled ? "Đã hủy" : order.status}
          </div>
        </div>

        <div className="p-6 md:p-10">
          {/* Progress Bar */}
          {!isCancelled ? (
            <div className="relative mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#F7B5D5] -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>

              <div className="relative z-10 flex justify-between w-full">
                {steps.map((step) => {
                  const isActive = currentStep >= step.id;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isActive
                            ? "bg-[#F7B5D5] border-[#F7B5D5] text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p
                        className={`text-xs md:text-sm font-bold ${
                          isActive ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.time && (
                        <p className="text-[10px] text-gray-500">
                          {moment(step.time).format("HH:mm DD/MM")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 mb-8 bg-red-50 rounded-xl border border-red-100 text-red-600">
              Đơn hàng này đã bị hủy. Vui lòng liên hệ CSKH nếu có nhầm lẫn.
            </div>
          )}

          {/* Chi tiết đơn hàng & Người nhận */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#F7B5D5]" /> Sản phẩm
              </h3>
              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        x{item.quantity} - {item.price.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-dashed mt-4 flex justify-between items-center font-bold text-lg">
                  <span>Tổng tiền:</span>
                  <span className="text-[#F7B5D5]">
                    {order.totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl h-fit">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F7B5D5]" /> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-bold">Người nhận:</span>{" "}
                  {order.shippingAddress.recipientName}
                </p>
                <p>
                  <span className="font-bold">SĐT:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="font-bold">Địa chỉ:</span>{" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
