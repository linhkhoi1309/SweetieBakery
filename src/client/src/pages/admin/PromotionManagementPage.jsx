import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Ticket,
  Loader2,
  Search,
  Calendar,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { http } from "../../libs/http";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/Dialog";

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Form State khớp hoàn toàn với Coupon.js Schema
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percent", // Khớp enum: 'percent', 'fixed'
    discountValue: "",
    maxDiscountAmount: "0", // Đúng tên trường schema
    minOrderValue: "0",
    startDate: "",
    endDate: "",
    usageLimit: "100",
    isActive: true,
  });

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const res = await http.get("/coupons");
      setPromotions(res.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenDialog = (promo = null) => {
    if (promo) {
      setSelectedPromo(promo);
      setFormData({
        ...promo,
        startDate: promo.startDate ? promo.startDate.split("T")[0] : "",
        endDate: promo.endDate ? promo.endDate.split("T")[0] : "",
      });
    } else {
      setSelectedPromo(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "percent",
        discountValue: "",
        maxDiscountAmount: "0",
        minOrderValue: "0",
        startDate: "",
        endDate: "",
        usageLimit: "100",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscountAmount:
          formData.discountType === "percent"
            ? Number(formData.maxDiscountAmount)
            : null,
        usageLimit: Number(formData.usageLimit),
      };

      if (selectedPromo) {
        await http.put(`/coupons/${selectedPromo._id}`, payload);
        toast.success("Cập nhật mã thành công!");
      } else {
        await http.post("/coupons", payload);
        toast.success("Tạo mã khuyến mãi mới thành công!");
      }
      setIsDialogOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi xử lý");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã này?")) return;
    try {
      await http.delete(`/coupons/${id}`);
      toast.success("Đã xóa mã giảm giá");
      fetchPromotions();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight italic">
            Sweetie Coupons 🎫
          </h1>
          <p className="text-gray-500 font-medium">
            Quản lý mã giảm giá theo hệ thống schema mới
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl px-6 h-12 shadow-lg shadow-pink-100"
        >
          <Plus className="mr-2 h-5 w-5" /> Tạo mã mới
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Mã Voucher</th>
                <th className="p-6">Loại & Giá trị</th>
                <th className="p-6 text-center">Đã dùng</th>
                <th className="p-6">Hết hạn</th>
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
              ) : (
                promotions.map((promo) => (
                  <tr
                    key={promo._id}
                    className="hover:bg-pink-50/10 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-[#F7B5D5]">
                          <Ticket size={20} />
                        </div>
                        <div>
                          <p className="font-black text-gray-800 uppercase tracking-tighter">
                            {promo.code}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold">
                            {promo.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge
                        variant="outline"
                        className="border-pink-200 text-[#F7B5D5] rounded-lg bg-pink-50/30"
                      >
                        {promo.discountType === "percent"
                          ? `Giảm ${promo.discountValue}%`
                          : `Giảm -${promo.discountValue.toLocaleString()}đ`}
                      </Badge>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        Tối thiểu: {promo.minOrderValue.toLocaleString()}đ
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <p className="text-sm font-black text-gray-600">
                        {promo.usedCount} / {promo.usageLimit}
                      </p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-gray-500 italic">
                        {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(promo)}
                          className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#F7B5D5] hover:text-white transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo._id)}
                          className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onOpenChange={setIsDialogOpen}
          className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">
              {selectedPromo ? "Cập nhật khuyến mãi ⚙️" : "Thiết lập mã mới ✨"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Mã Code *
                </Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: SWEETIE50"
                  required
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Tên hiển thị *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Ưu đãi tân thủ"
                  required
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>

              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Loại giảm giá
                </Label>
                <select
                  className="w-full h-11 border border-pink-100 rounded-2xl px-4 bg-white text-sm font-medium focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                >
                  <option value="percent">Giảm theo Phần trăm (%)</option>
                  <option value="fixed">Giảm Số tiền cố định (đ)</option>
                </select>
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Giá trị giảm *
                </Label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  required
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>

              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Đơn hàng tối thiểu (đ)
                </Label>
                <Input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderValue: e.target.value })
                  }
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Giảm tối đa (đ) - Nếu là %
                </Label>
                <Input
                  type="number"
                  disabled={formData.discountType === "fixed"}
                  value={formData.maxDiscountAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountAmount: e.target.value,
                    })
                  }
                  className="rounded-2xl border-pink-100 h-11 disabled:bg-gray-50"
                />
              </div>

              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Ngày bắt đầu *
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="font-bold ml-1 text-gray-700">
                  Ngày kết thúc *
                </Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  className="rounded-2xl border-pink-100 h-11"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="font-bold ml-1 text-gray-700">
                  Mô tả điều kiện
                </Label>
                <textarea
                  className="w-full border border-pink-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="VD: Chỉ áp dụng cho các loại bánh kem..."
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl h-12 font-bold shadow-lg shadow-pink-100 transition-all active:scale-95 hover:cursor-pointer"
              >
                {selectedPromo
                  ? "Cập nhật cấu hình"
                  : "Kích hoạt khuyến mãi ngay"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionManagementPage;
