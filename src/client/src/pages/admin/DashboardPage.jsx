import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  FileDown,
  Loader2,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import { http } from "../../libs/http";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

// Helper components cho Dashboard
const StatCard = ({ title, value, icon: Icon, change, positive }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-xl shadow-pink-100/20 group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center group-hover:bg-[#F7B5D5] transition-colors">
        <Icon className="h-6 w-6 text-[#F7B5D5] group-hover:text-white" />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
          positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}
      >
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">
      {title}
    </p>
    <p className="text-2xl font-black text-gray-800 tracking-tight">{value}</p>
  </div>
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        http.get("/orders/stats"),
        http.get("/orders"),
      ]);

      console.log(statsRes);
      console.log(ordersRes);

      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data?.slice(0, 5) || []);
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thống kê thực tế");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !stats)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#F7B5D5] h-12 w-12" />
      </div>
    );

  // Mảng hiển thị các thẻ Stats lấy từ dữ liệu thực
  const statCards = [
    {
      title: "Doanh số thực",
      value: `${stats.summary.totalRevenue.toLocaleString()}đ`,
      icon: DollarSign,
      change: "Tổng cộng",
      positive: true,
    },
    {
      title: "Đơn hôm nay",
      value: stats.summary.newOrdersToday,
      icon: ShoppingBag,
      change: `+${stats.summary.todayRevenue.toLocaleString()}đ`,
      positive: true,
    },
    {
      title: "Khách hàng",
      value: stats.summary.totalUsers,
      icon: Users,
      change: "Tài khoản thực",
      positive: true,
    },
    {
      title: "Tổng đơn hàng",
      value: stats.summary.totalOrders,
      icon: TrendingUp,
      change: "Tất cả trạng thái",
      positive: true,
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700",
      Processing: "bg-blue-100 text-blue-700",
      Shipping: "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const handleExportReport = () => {
    toast.loading("Đang khởi tạo báo cáo phân tích...");

    setTimeout(() => {
      // Tính toán thêm một số chỉ số phụ từ chartData (7 ngày gần nhất)
      const totalWeeklyRevenue = stats.chartData.reduce(
        (sum, day) => sum + day.doanhthu,
        0
      );
      const totalWeeklyOrders = stats.chartData.reduce(
        (sum, day) => sum + day.donhang,
        0
      );
      const avgOrderValue =
        totalWeeklyOrders > 0
          ? Math.round(totalWeeklyRevenue / totalWeeklyOrders)
          : 0;

      const reportContent = `
╔════════════════════════════════════════════════════════════════╗
║          SWEETIEBAKERY - BÁO CÁO PHÂN TÍCH KINH DOANH         ║
╚════════════════════════════════════════════════════════════════╝

📅 Ngày xuất: ${new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TỔNG QUAN KINH DOANH (REAL-TIME)

  💰 Doanh số thực tế (Tổng):    ${stats.summary.totalRevenue.toLocaleString(
    "vi-VN"
  )}đ
  💵 Doanh thu hôm nay:         ${stats.summary.todayRevenue.toLocaleString(
    "vi-VN"
  )}đ
  📦 Đơn hàng mới hôm nay:       ${stats.summary.newOrdersToday} đơn
  👥 Tổng khách hàng thực:       ${stats.summary.totalUsers} tài khoản
  📈 Tổng số đơn hàng:           ${stats.summary.totalOrders} đơn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 BIẾN ĐỘNG DOANH THU 7 NGÀY QUA

${stats.chartData
  .map(
    (day) =>
      `  • Ngày ${day.name}: ${day.doanhthu.toLocaleString("vi-VN")}đ (${
        day.donhang
      } đơn)`
  )
  .join("\n")}
  
  ────────────────────────────────────────────────────
  TỔNG TUẦN:  ${totalWeeklyRevenue.toLocaleString(
    "vi-VN"
  )}đ (${totalWeeklyOrders} đơn)
  TRUNG BÌNH: ${avgOrderValue.toLocaleString("vi-VN")}đ/đơn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 5 ĐƠN HÀNG MỚI NHẤT TRÊN HỆ THỐNG

${recentOrders
  .map(
    (o) => `
  ID: #${o._id
    .slice(-6)
    .toUpperCase()} | Khách: ${o.shippingAddress.recipientName.padEnd(
      15
    )} | ${new Date(o.createdAt).toLocaleDateString("vi-VN")}
  Tổng: ${o.totalPrice.toLocaleString("vi-VN").padEnd(12)}đ | Trạng thái: ${
      o.status
    }
`
  )
  .join("")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 GHI CHÚ

• Báo cáo được trích xuất tự động từ cơ sở dữ liệu MongoDB.
• Số liệu doanh thu không bao gồm các đơn hàng đã bị hủy (Cancelled).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍰 SweetieBakery - Mang đến những chiếc bánh ngọt ngào
    `;

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SweetieBakery_Analytical_Report_${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.dismiss();
      toast.success("Đã xuất báo cáo thực tế!");
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight italic">
            Dashboard ✨
          </h1>
          <p className="text-gray-500 font-medium italic">
            Chào mừng bạn trở lại, Admin SweetieBakery
          </p>
        </div>
        <Button
          onClick={handleExportReport}
          className="bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl px-6 h-12 shadow-lg shadow-pink-100 font-bold transition-all active:scale-95"
        >
          <FileDown className="mr-2 h-5 w-5" />
          Xuất báo cáo phân tích
        </Button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Biểu đồ với dữ liệu thực từ stats.chartData */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-xl">
          <h3 className="text-lg font-black text-gray-800 mb-6">
            Biến động doanh thu tuần qua
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => v.toLocaleString() + "đ"} />
                <Bar dataKey="doanhthu" fill="#F7B5D5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ tần suất đơn hàng dùng stats.chartData */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-xl">
          <h3 className="text-lg font-black text-gray-800 mb-6">
            Số lượng đơn hàng mỗi ngày
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="donhang"
                  stroke="#F7B5D5"
                  fill="#F7B5D5"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl shadow-pink-100/20 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-xl text-gray-800 tracking-tight">
            Đơn hàng mới nhận 🍰
          </h3>
          <Button
            variant="ghost"
            className="text-[#F7B5D5] font-bold"
            onClick={() => (window.location.href = "/admin/orders")}
          >
            Xem tất cả
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Mã đơn</th>
                <th className="p-6">Khách hàng</th>
                <th className="p-6 text-center">Tổng tiền</th>
                <th className="p-6">Trạng thái</th>
                <th className="p-6">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#F7B5D5]" />
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-pink-50/10 transition-colors"
                  >
                    <td className="p-6 font-mono font-black text-gray-500 uppercase tracking-tighter">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-800">
                        {order.shippingAddress.recipientName}
                      </p>
                      <p className="text-[10px] text-gray-400 italic">
                        COD Payment
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="font-black text-[#F7B5D5] text-lg">
                        {order.totalPrice.toLocaleString()}đ
                      </span>
                    </td>
                    <td className="p-6">
                      <Badge
                        className={`${getStatusStyle(
                          order.status
                        )} rounded-xl font-bold border-none`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-6 text-sm text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
