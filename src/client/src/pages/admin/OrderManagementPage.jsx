import { useState, useEffect } from "react";
import {
  Eye,
  Search,
  Loader2,
  MapPin,
  Phone,
  User,
  Calendar,
  Hash,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment"; // Cài đặt nếu chưa có: npm install moment

import { http } from "../../libs/http";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/Dialog";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusOptions = [
    {
      value: "Pending",
      label: "Chờ xử lý",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Processing",
      label: "Đang chuẩn bị",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Shipping",
      label: "Đang giao hàng",
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "Delivered",
      label: "Đã giao thành công",
      color: "bg-green-100 text-green-700",
    },
    { value: "Cancelled", label: "Đã hủy", color: "bg-red-100 text-red-700" },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await http.get("/orders");
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error("Lỗi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await http.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.recipientName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-500 font-medium">
            Theo dõi và cập nhật trạng thái đơn hàng SweetieBakery
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Mã Đơn</th>
                <th className="p-6">Khách Hàng</th>
                <th className="p-6">Tổng Tiền</th>
                <th className="p-6">Trạng Thái</th>
                <th className="p-6 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#F7B5D5] h-10 w-10" />
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-pink-50/20 transition-colors group"
                  >
                    <td className="p-6">
                      <span className="font-mono font-black text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-800">
                        {order.shippingAddress.recipientName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.shippingAddress.phone}
                      </p>
                    </td>
                    <td className="p-6 font-black text-[#F7B5D5] text-lg">
                      {order.totalPrice.toLocaleString()}đ
                    </td>
                    <td className="p-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        className={`p-2 rounded-xl text-xs font-bold border-none outline-none ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-pink-200 transition-all ${
                          statusOptions.find((s) => s.value === order.status)
                            ?.color
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-white text-gray-800 font-semibold"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDialogOpen(true);
                        }}
                        className="p-3 bg-gray-100 rounded-2xl text-gray-400 group-hover:bg-[#F7B5D5] group-hover:text-white transition-all shadow-sm"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Chi Tiết Đơn Hàng */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* QUAN TRỌNG: Truyền onOpenChange xuống DialogContent để nút X hoạt động */}
        <DialogContent onOpenChange={setIsDialogOpen} className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-6 w-6 text-[#F7B5D5]" />
              Chi tiết đơn hàng #{selectedOrder?._id.slice(-6).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Xem thông tin vận chuyển và danh sách sản phẩm khách hàng đã chọn.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-8 mt-4">
              {/* Thông tin đơn hàng và khách hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50/30 p-6 rounded-[2rem] border border-pink-100">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3 w-3" /> Người nhận hàng
                  </h4>
                  <div className="space-y-1">
                    <p className="font-black text-gray-800 text-lg">
                      {selectedOrder.shippingAddress.recipientName}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                      <Phone className="h-4 w-4 text-[#F7B5D5]" />{" "}
                      {selectedOrder.shippingAddress.phone}
                    </p>
                    <p className="flex items-start gap-2 text-sm text-gray-500 italic">
                      <MapPin className="h-4 w-4 mt-0.5 text-[#F7B5D5]" />
                      {selectedOrder.shippingAddress.address},{" "}
                      {selectedOrder.shippingAddress.city}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Thông tin đơn
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">
                        Ngày đặt:
                      </span>
                      <span className="font-bold text-gray-800">
                        {moment(selectedOrder.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">
                        Trạng thái:
                      </span>
                      <Badge
                        className={
                          statusOptions.find(
                            (s) => s.value === selectedOrder.status
                          )?.color
                        }
                      >
                        {
                          statusOptions.find(
                            (s) => s.value === selectedOrder.status
                          )?.label
                        }
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">
                        Thanh toán:
                      </span>
                      <span className="font-black text-pink-500 uppercase">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4 ml-1">
                  <Package className="h-3 w-3" /> Danh sách bánh (
                  {selectedOrder.orderItems.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {selectedOrder.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-pink-200 transition-all shadow-sm"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-50 shadow-sm"
                          alt={item.name}
                        />
                        <div>
                          <p className="font-black text-gray-800">
                            {item.name}
                          </p>
                          {/* Hiển thị số lượng và giá đơn chiếc */}
                          <p className="text-xs text-gray-400 font-bold">
                            Số lượng: {item.quantity} • Giá:{" "}
                            {item.price.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#F7B5D5]">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="pt-6 border-t border-dashed border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-500 font-bold">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {selectedOrder.shippingPrice?.toLocaleString() || 0}đ
                    </span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-red-400 font-bold">
                      <span>Giảm giá voucher:</span>
                      <span>
                        -{selectedOrder.discountAmount.toLocaleString()}đ
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-gray-800 uppercase tracking-tighter">
                      Tổng quyết toán
                    </span>
                    <span className="text-3xl font-black text-[#F7B5D5]">
                      {selectedOrder.totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagementPage;
