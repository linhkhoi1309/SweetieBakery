import { useState, useEffect } from "react";
import {
  Search,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Users as UsersIcon,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { http } from "../../libs/http";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/Dialog";

const CustomerManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // States cho Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("deactivate");

  // 1. Lấy danh sách người dùng từ Database
  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await http.get(`/users?page=${page}&limit=10`);
      if (res.data.success) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page);
  }, [pagination.page]);

  // 2. Logic Tìm kiếm (Client-side filter cho mảng hiện tại)
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
  );

  // 3. Xử lý Vô hiệu hóa / Xóa
  const handleAction = async () => {
    if (!selectedUser) return;

    try {
      if (actionType === "deactivate") {
        await http.post(`/users/deactivate/${selectedUser._id}`);
        toast.success(`Đã vô hiệu hóa tài khoản ${selectedUser.name}`);
      } else if (actionType === "activate") {
        await http.post(`/users/activate/${selectedUser._id}`);
        toast.success(`Đã kích hoạt lại tài khoản ${selectedUser.name}`);
      } else {
        await http.delete(`/users/${selectedUser._id}`);
        toast.success(`Đã xóa vĩnh viễn tài khoản ${selectedUser.name}`);
      }

      setIsDialogOpen(false);
      fetchUsers(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const openConfirmDialog = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 italic tracking-tight">
            Customer Management 👤
          </h1>
          <p className="text-gray-500 font-medium italic">
            Quản lý tài khoản khách hàng SweetieBakery
          </p>
        </div>
      </div>

      {/* Stats Cards (Tổng hợp từ dữ liệu trả về) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-xl shadow-pink-100/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">
              {pagination.total || 0}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tổng khách hàng
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-xl shadow-pink-100/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">
              {users.filter((u) => u.isActive).length}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Đang hoạt động
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-xl shadow-pink-100/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">
              {users.filter((u) => !u.isActive).length}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Bị vô hiệu hóa
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Khách hàng</th>
                <th className="p-6">Liên hệ</th>
                <th className="p-6 text-center">Ngày tham gia</th>
                <th className="p-6 text-center">Trạng thái</th>
                <th className="p-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#F7B5D5] h-10 w-10" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-pink-50/10 transition-colors group font-medium"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#F7B5D5] font-black">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.name}</p>
                          {user.role === "admin" && (
                            <Badge className="bg-purple-500 h-4 text-[9px]">
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />{" "}
                          {user.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />{" "}
                          {user.phone || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-6 text-center text-sm text-gray-500">
                      <p className="flex justify-center items-center gap-1">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <Badge
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {user.isActive ? "Hoạt động" : "Bị khóa"}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      {user.role !== "admin" ? (
                        <div className="flex justify-end gap-2">
                          {user.isActive ? (
                            <button
                              onClick={() =>
                                openConfirmDialog(user, "deactivate")
                              }
                              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Khóa tài khoản"
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openConfirmDialog(user, "activate")
                              }
                              className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Mở khóa tài khoản"
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => openConfirmDialog(user, "delete")}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase italic mr-4">
                          Không khả dụng
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination */}
        <div className="p-6 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase">
            Trang {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="rounded-xl border-pink-100 text-pink-400"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="rounded-xl border-pink-100 text-pink-400"
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-gray-800">
              {actionType === "deactivate" && "Xác nhận khóa 🔒"}
              {actionType === "activate" && "Mở khóa tài khoản 🔓"}
              {actionType === "delete" && "Xóa vĩnh viễn 🗑️"}
            </DialogTitle>
            <DialogDescription className="pt-2 font-medium">
              Bạn có chắc chắn muốn thực hiện thao tác này với{" "}
              <strong>{selectedUser?.name}</strong>?
              <br />
              <br />
              {actionType === "deactivate" &&
                "Tài khoản sẽ không thể đăng nhập hoặc đặt hàng."}
              {actionType === "activate" &&
                "Người dùng sẽ có thể đăng nhập và đặt hàng trở lại."}
              {actionType === "delete" &&
                "Dữ liệu sẽ bị xóa hoàn toàn và không thể khôi phục."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleAction}
              className={`rounded-2xl h-12 font-bold text-white shadow-lg ${
                actionType === "activate"
                  ? "bg-green-600"
                  : actionType === "deactivate"
                  ? "bg-red-500"
                  : "bg-black"
              }`}
            >
              Xác nhận thực hiện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagementPage;
