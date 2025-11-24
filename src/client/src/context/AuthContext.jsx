// src/client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng sau khi login/logout

// 1. Khởi tạo Context
const AuthContext = createContext();

// Hook tùy chỉnh để sử dụng Context dễ dàng
export const useAuth = () => useContext(AuthContext);

// 2. Component Provider chính
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin user (id, name, email, role, token...)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Trạng thái đang kiểm tra Local Storage

  const navigate = useNavigate(); // Hook chuyển hướng

  // --- LOGIC DUY TRÌ PHIÊN (NFR-UX.3) ---
  useEffect(() => {
    // 1. Lấy dữ liệu user từ Local Storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // TODO: Cần kiểm tra token/thời gian hết hạn ở đây để bảo mật hơn

        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        // Nếu parse lỗi (dữ liệu bị hỏng), xóa bỏ dữ liệu cũ
        localStorage.removeItem("user");
      }
    }
    // Kết thúc quá trình loading ban đầu
    setLoading(false);
  }, []);

  // --- HÀM LOGIN (Sử dụng trong LoginPage.jsx) ---
  const login = (userData) => {
    // 1. Cập nhật trạng thái Context
    setUser(userData);
    setIsAuthenticated(true);

    // 2. Lưu vào Local Storage
    localStorage.setItem("user", JSON.stringify(userData));

    // 3. Chuyển hướng theo vai trò (FR-A/U.1 & NFR-S.3)
    if (userData.role === "Admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  // --- HÀM LOGOUT (Sử dụng trong Header/Sidebar) ---
  const logout = () => {
    // 1. Cập nhật trạng thái Context
    setUser(null);
    setIsAuthenticated(false);

    // 2. Xóa khỏi Local Storage
    localStorage.removeItem("user");

    // 3. Chuyển hướng về trang Đăng nhập
    navigate("/login", { replace: true });
  };

  // Giá trị được cung cấp cho toàn bộ ứng dụng
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  // Chỉ render children khi đã kiểm tra xong Local Storage
  if (loading) {
    // Tùy chọn: Hiển thị một màn hình loading toàn cục tại đây
    return <div>Đang kiểm tra phiên đăng nhập...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
