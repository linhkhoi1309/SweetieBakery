import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Package,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Badge } from "../../ui/Badge";

const AccountTabs = ({
  activeTab,
  setActiveTab,
  user,
  formData,
  setFormData,
  passwordData,
  setPasswordData,
  showPwd,
  setShowPwd,
  handleUpdateProfile,
  handleChangePassword,
  buyingOrders,
  boughtOrders,
  isSubmitting,
  navigate,
  getStatusStyle,
}) => {
  const tabs = [
    { id: "profile", label: "Hồ sơ" },
    { id: "update", label: "Sửa đổi" },
    { id: "password", label: "Mật khẩu" },
    { id: "orders", label: "Đơn hàng" },
  ];

  return (
    <div className="w-full">
      <div className="inline-flex h-12 items-center justify-center rounded-2xl bg-gray-100/80 p-1 text-gray-500 w-full mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition-all focus:outline-none hover:cursor-pointer
              ${
                activeTab === tab.id
                  ? "bg-white text-[#F7B5D5] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Tab: Xem hồ sơ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-[2rem] border-2 border-pink-50 p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserIcon className="text-[#F7B5D5]" /> Thông Tin Cá Nhân
            </h3>
            <div className="grid gap-4">
              {[
                { icon: UserIcon, label: "Họ và tên", value: user?.name },
                { icon: Mail, label: "Email", value: user?.email },
                {
                  icon: Phone,
                  label: "Số điện thoại",
                  value: user?.phone || "Chưa cập nhật",
                },
                {
                  icon: MapPin,
                  label: "Địa chỉ",
                  value: `${user?.address || "Chưa cập nhật"}, ${
                    user?.city || ""
                  }`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-pink-50/30 rounded-2xl"
                >
                  <item.icon className="h-5 w-5 text-[#F7B5D5]" />
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                      {item.label}
                    </p>
                    <p className="font-bold text-gray-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Cập nhật thông tin */}
        {activeTab === "update" && (
          <div className="bg-white rounded-[2rem] border-2 border-pink-50 p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Edit2 size={20} className="text-[#F7B5D5]" /> Cập nhật thông tin
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-xl border-pink-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="rounded-xl border-pink-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ nhà</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="rounded-xl border-pink-100"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F7B5D5] text-white rounded-2xl h-12 font-bold shadow-lg shadow-pink-100 transition-all active:scale-95 hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Tab: Đổi mật khẩu */}
        {activeTab === "password" && (
          <div className="bg-white rounded-[2rem] border-2 border-pink-50 p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-[#F7B5D5]" /> Đổi mật khẩu bảo mật
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    type={showPwd.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="rounded-xl border-pink-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd({ ...showPwd, current: !showPwd.current })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showPwd.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="rounded-xl border-pink-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd({ ...showPwd, new: !showPwd.new })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPwd.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showPwd.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="rounded-xl border-pink-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd({ ...showPwd, confirm: !showPwd.confirm })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPwd.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-800 text-white rounded-2xl h-12 font-bold shadow-lg transition-all active:scale-95"
              >
                Cập nhật mật khẩu
              </Button>
            </form>
          </div>
        )}

        {/* Tab: Đơn hàng */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Sub-tabs đơn giản cho Orders */}
            <div className="grid grid-cols-1 gap-8">
              <section>
                <h4 className="font-black text-gray-400 uppercase text-xs tracking-[0.2em] mb-4">
                  Đang xử lý ({buyingOrders.length})
                </h4>
                <div className="space-y-4">
                  {buyingOrders.length === 0 ? (
                    <div className="p-8 bg-gray-50 rounded-[2rem] text-center text-gray-400 italic">
                      Trống
                    </div>
                  ) : (
                    buyingOrders.map((order) => (
                      <div
                        key={order._id}
                        className="p-6 bg-white rounded-3xl border border-pink-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="p-3 bg-pink-50 rounded-2xl">
                            <Package className="text-[#F7B5D5]" />
                          </div>
                          <div>
                            <p className="font-black text-gray-800 uppercase text-xs tracking-tighter">
                              #{order._id.slice(-6)}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusStyle(order.status)}>
                          {order.status}
                        </Badge>
                        <p className="font-black text-[#F7B5D5]">
                          {order.totalPrice.toLocaleString()}đ
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/order-tracking/${order._id}`)
                          }
                          className="rounded-xl border-pink-200 text-[#F7B5D5] font-bold"
                        >
                          Theo dõi
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section>
                <h4 className="font-black text-gray-400 uppercase text-xs tracking-[0.2em] mb-4">
                  Lịch sử hoàn tất ({boughtOrders.length})
                </h4>
                <div className="space-y-4">
                  {boughtOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-6 bg-white rounded-3xl border border-pink-50 shadow-sm flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="text-green-500" />
                        <div>
                          <p className="font-bold text-gray-800">
                            #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Ngày đặt:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-800">
                          {order.totalPrice.toLocaleString()}đ
                        </p>
                        <Button
                          variant="ghost"
                          className="text-[10px] text-[#F7B5D5] font-black uppercase hover:bg-pink-50 p-0 h-auto"
                          onClick={() => navigate(`/products`)}
                        >
                          Mua lại
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTabs;
