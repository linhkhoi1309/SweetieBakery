import { useState, useRef } from "react";
import { Heart, LogOut, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { http } from "../../../libs/http.js";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";

const AccountSidebar = ({ user, navigate, onProfileUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    //localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  // Kích hoạt ô chọn file
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng và dung lượng (VD: < 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Kích thước ảnh phải nhỏ hơn 2MB");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file); // Key 'image' khớp với uploadMiddleware

    try {
      // Bước 1: Upload ảnh lên Cloudinary qua server của bạn
      const uploadRes = await http.post("/upload", formData);

      if (uploadRes.data.success) {
        const imageUrl = uploadRes.data.data.url;

        // Bước 2: Cập nhật URL ảnh mới vào thông tin người dùng
        await http.put("/users/profile", { avatar: imageUrl });

        toast.success("Cập nhật ảnh đại diện thành công!");

        // Gọi callback để trang cha (Account.jsx) cập nhật lại UI
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-pink-50 p-8 shadow-xl shadow-pink-100/20 text-center h-fit">
      {/* Avatar Container với Nút Camera */}
      <div className="relative inline-block mb-4 group">
        <div className="w-24 h-24 rounded-3xl bg-[#F7B5D5] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-100 overflow-hidden border-4 border-white">
          {isUploading ? (
            <Loader2 className="animate-spin" />
          ) : user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>

        {/* Nút overlay để chọn file */}
        <button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-md border border-pink-50 text-[#F7B5D5] hover:bg-pink-50 transition-all active:scale-90 group-hover:scale-110"
        >
          <Camera size={16} />
        </button>

        {/* Input ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <h2 className="text-2xl font-black text-gray-800 tracking-tight">
        {user?.name}
      </h2>
      <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
      {user?.role === "admin" && (
        <Badge className="mt-3 bg-[#F7B5D5]">Quản trị viên</Badge>
      )}

      <div className="mt-8 pt-6 border-t border-dashed border-pink-100 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl text-gray-600 hover:text-[#F7B5D5] hover:cursor-pointer"
          onClick={() => navigate("/wishlist")}
        >
          <Heart className="mr-3 h-5 w-5" /> Danh sách yêu thích
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl text-red-500 hover:bg-red-50 hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" /> Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default AccountSidebar;
