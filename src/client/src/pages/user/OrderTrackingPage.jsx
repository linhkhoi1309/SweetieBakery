import {
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

const OrderTrackingPage = () => {
  const params = useParams();
  const orderID = params?.id || null;

  console.log(orderID);

  // Mock status - Trong thực tế sẽ lấy từ API/Context
  const currentStatus = "baking"; // pending, confirmed, baking, shipping, completed

  const statuses = [
    {
      id: "pending",
      title: "Chờ xử lý",
      description: "Đơn hàng đã được tiếp nhận",
      icon: Clock,
      date: "12/11/2024 10:30",
    },
    {
      id: "confirmed",
      title: "Đã xác nhận",
      description: "Đơn hàng đã được xác nhận",
      icon: CheckCircle2,
      date: "12/11/2024 10:45",
    },
    {
      id: "baking",
      title: "Đang làm bánh",
      description: "Đầu bếp đang chuẩn bị bánh của bạn",
      icon: Package,
      date: "12/11/2024 11:00",
    },
    {
      id: "shipping",
      title: "Đang giao hàng",
      description: "Đơn hàng đang trên đường giao đến bạn",
      icon: Truck,
      date: "",
    },
    {
      id: "completed",
      title: "Hoàn thành",
      description: "Đơn hàng đã được giao thành công",
      icon: Check,
      date: "",
    },
  ];

  const getStatusIndex = () => {
    return statuses.findIndex((s) => s.id === currentStatus);
  };

  const currentIndex = getStatusIndex();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Thay thế Card bằng div custom theo style SweetieBakery */}
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border-2 border-pink-50 shadow-xl shadow-pink-100/50 overflow-hidden">
        {/* Header của trang tracking */}
        <div className="bg-[#F7B5D5]/10 p-8 text-center border-b border-pink-50">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-pink-100">
            <Package className="h-10 w-10 text-[#F7B5D5]" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">
            Theo Dõi Đơn Hàng
          </h1>
          <p className="text-gray-500 font-medium">
            Mã đơn hàng:{" "}
            <span className="text-[#F7B5D5] font-bold">#{orderID}</span>
          </p>
        </div>

        <div className="p-8 sm:p-10">
          {/* Danh sách các trạng thái (Progress Stepper) */}
          <div className="space-y-10 relative">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={status.id} className="relative flex gap-6">
                  {/* Đường kẻ nối giữa các icon */}
                  {index < statuses.length - 1 && (
                    <div
                      className={`absolute left-6 top-14 w-0.5 h-12 transition-colors duration-500 ${
                        index < currentIndex ? "bg-[#F7B5D5]" : "bg-gray-100"
                      }`}
                    />
                  )}

                  {/* Icon trạng thái */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 z-10 ${
                      isCompleted
                        ? "bg-[#F7B5D5] border-[#F7B5D5] text-white shadow-lg shadow-pink-200"
                        : "bg-white border-gray-200 text-gray-300"
                    } ${isCurrent ? "ring-4 ring-pink-100 animate-pulse" : ""}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Nội dung trạng thái */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-bold transition-colors ${
                          isCompleted ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {status.title}
                      </h3>
                      {status.date && (
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                          {status.date}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {status.description}
                    </p>

                    {isCurrent && status.id !== "completed" && (
                      <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#F7B5D5] uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7B5D5]"></span>
                        </span>
                        Đang thực hiện
                      </div>
                    )}

                    {isCurrent && status.id === "completed" && (
                      <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                        Đã hoàn thành
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thông tin giao hàng */}
          <div className="mt-12 pt-8 border-t border-dashed border-pink-100 space-y-6">
            <div className="bg-[#FFF0D9]/40 p-6 rounded-4xl border border-[#FFF0D9] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MapPin className="w-12 h-12 text-[#f39c12]" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                🏠 Thông tin nhận hàng
              </h4>
              <div className="text-sm text-gray-600 space-y-2 relative z-10">
                <p className="font-bold text-gray-700">Nguyễn Văn A</p>
                <p className="flex items-center gap-2">📞 0123 456 789</p>
                <p className="flex items-start gap-2 italic">
                  📍 123 Đường ABC, Quận 1, TP.HCM
                </p>
              </div>
            </div>

            {/* Nhóm nút điều hướng */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/">
                <button className="flex-1 px-2 py-4 border-2 border-pink-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:cursor-pointer">
                  Về trang chủ
                </button>
              </Link>
              <Link to="/products">
                <button className="flex-1 px-2 py-4 bg-[#F7B5D5] text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-[#f39cb4] transition-all hover:cursor-pointer">
                  Tiếp tục mua sắm 🧁
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
