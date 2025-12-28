import { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  Check,
  X,
  MessageSquare,
  Loader2,
  Search,
  User,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import { http } from "../../libs/http";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
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

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await http.get("/reviews"); // Gọi đến reviewsRoutes.js (Admin)
      setReviews(res.data.data || []);
      console.log(res.data.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await http.put(`/reviews/${id}/status`, { status });
      toast.success(`Đã chuyển trạng thái sang: ${status.toUpperCase()}`);
      fetchReviews(); // Tải lại để cập nhật điểm trung bình sản phẩm (Backend lo)
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim())
      return toast.error("Vui lòng nhập nội dung phản hồi");

    try {
      await http.put(`/reviews/${selectedReview._id}/reply`, {
        reply: replyText,
      });
      toast.success("Đã gửi phản hồi thành công!");
      setIsReplyOpen(false);
      setReplyText("");
      fetchReviews();
    } catch (error) {
      toast.error("Lỗi khi gửi phản hồi");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusMap = {
    pending: {
      label: "Chờ duyệt",
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    },
    approved: {
      label: "Đã duyệt",
      color: "bg-green-100 text-green-600 border-green-200",
    },
    rejected: {
      label: "Đã từ chối",
      color: "bg-red-100 text-red-600 border-red-200",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-800 italic tracking-tight">
          Review Management ✨
        </h1>
        <p className="text-gray-500 font-medium italic">
          Quản lý và phản hồi đánh giá từ khách hàng
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm theo tên bánh, khách hàng hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Khách hàng</th>
                <th className="p-6">Sản phẩm</th>
                <th className="p-6">Nội dung & Sao</th>
                <th className="p-6 text-center">Trạng thái</th>
                <th className="p-6 text-right">Thao tác</th>
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
                filteredReviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-pink-50/10 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#F7B5D5] font-black">
                          {review.user?.avatar ? (
                            <img
                              className="rounded-full"
                              src={review.user?.avatar}
                              alt="Avatar"
                            />
                          ) : (
                            "U"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {review.user?.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {review.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-[#F7B5D5] text-sm uppercase tracking-tight line-clamp-1 italic">
                        {review.product?.name}
                      </p>
                    </td>
                    <td className="p-6 max-w-[300px]">
                      <div className="flex gap-0.5 text-yellow-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed italic font-medium">
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <Badge
                        variant="outline"
                        className={`rounded-lg ${
                          statusMap[review.status].color
                        }`}
                      >
                        {statusMap[review.status].label}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(review._id, "approved")
                          }
                          className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Phê duyệt"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setReplyText(review.adminReply || "");
                            setIsReplyOpen(true);
                          }}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Phản hồi"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(review._id, "rejected")
                          }
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Từ chối"
                        >
                          <X size={16} />
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

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent onOpenChange={setIsReplyOpen} className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="text-[#F7B5D5]" /> Phản hồi khách hàng
            </DialogTitle>
            <DialogDescription>
              Gửi lời cảm ơn hoặc giải đáp thắc mắc của{" "}
              {selectedReview?.user?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-gray-50 p-5 rounded-[2rem] border border-dashed border-pink-200">
              <div className="flex gap-0.5 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i < (selectedReview?.rating || 0)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600 italic font-medium">
                "{selectedReview?.comment}"
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-black text-gray-700 ml-1">
                Lời nhắn từ SweetieBakery 🧁
              </Label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Cảm ơn bạn đã tin tưởng SweetieBakery..."
                className="w-full h-32 p-4 rounded-[2rem] border border-pink-100 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReplyOpen(false)}
              className="rounded-2xl h-12 px-8 border-gray-200"
            >
              Đóng
            </Button>
            <Button
              onClick={handleReplySubmit}
              className="bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-pink-100"
            >
              Gửi phản hồi ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagementPage;
