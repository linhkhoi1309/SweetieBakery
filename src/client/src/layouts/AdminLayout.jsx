import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Tag,
  Database,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import logoImage from "../assets/logo.png";
import { useAuthStore } from "../store/useAuthStore";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: Package },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
    { href: "/admin/customers", label: "Khách hàng", icon: Users },
    { href: "/admin/reviews", label: "Đánh giá", icon: MessageSquare },
    { href: "/admin/promotions", label: "Khuyến mãi", icon: Tag },
    { href: "/admin/logs", label: "System Logs", icon: FileText },
    { href: "/admin/backup", label: "Backup DB", icon: Database },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Cố định bên trái */}
      <aside className="w-64 bg-[#111827] text-gray-400 flex flex-col sticky top-0 h-screen shadow-xl">
        {/* Logo Section */}
        <div className="p-8 flex justify-center border-b border-gray-800/50">
          <Link to="/">
            <img
              src={logoImage}
              alt="SweetieBakery Admin"
              className="w-[104px] h-[84px] object-contain hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Kiểm tra active dựa trên pathname
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#F7B5D5] text-white shadow-lg shadow-pink-500/20 scale-[1.02]"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "group-hover:text-[#F7B5D5] transition-colors"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
            >
              <LogOut className="h-5 w-5 mr-3 rotate-180" />
              Về trang chủ
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Đăng xuất Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header - Chứa tiêu đề trang hiện tại */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {navItems.find((item) => pathname.startsWith(item.href))?.label ||
              "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 italic">
                Admin Mode
              </p>
              <p className="text-xs text-gray-500">Quản lý hệ thống</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#F7B5D5] flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
