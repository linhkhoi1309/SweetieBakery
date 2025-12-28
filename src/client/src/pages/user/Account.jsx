import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { http } from "../../libs/http.js";
import AccountSidebar from "../../components/features/account/AccountSidebar";
import AccountTabs from "../../components/features/account/AccountTabs";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // State cho Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        http.get("/users/profile"),
        http.get("/orders/myorders"),
      ]);
      const userData = profileRes.data.user;

      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
      });
      setOrders(ordersRes.data.data || []);
    } catch (error) {
      toast.error("Không thể tải thông tin tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await http.put("/users/profile", formData);
      toast.success("Cập nhật thành công!");
      fetchData();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp");
    setIsSubmitting(true);
    try {
      await http.put("/users/change-password", passwordData);
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#F7B5D5]" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <AccountSidebar
          user={user}
          navigate={navigate}
          onProfileUpdate={fetchData}
        />

        <div className="lg:col-span-2">
          <AccountTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            formData={formData}
            setFormData={setFormData}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            showPwd={showPwd}
            setShowPwd={setShowPwd}
            handleUpdateProfile={handleUpdateProfile}
            handleChangePassword={handleChangePassword}
            buyingOrders={orders.filter((o) =>
              ["Pending", "Processing", "Shipping"].includes(o.status)
            )}
            boughtOrders={orders.filter((o) =>
              ["Delivered", "Cancelled"].includes(o.status)
            )}
            isSubmitting={isSubmitting}
            navigate={navigate}
            getStatusStyle={getStatusStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Account;
