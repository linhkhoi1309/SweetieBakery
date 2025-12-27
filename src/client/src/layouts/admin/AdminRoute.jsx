import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

const AdminRoute = ({ children }) => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7B5D5]"></div>
      </div>
    );

  // Nếu không đăng nhập hoặc không phải admin thì đá về trang chủ
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
