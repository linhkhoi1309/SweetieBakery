import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyCodePage from "./pages/auth/VerifyCodePage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import HomePage from "./pages/user/HomePage";
import ProductPage from "./pages/user/ProductPage";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import AboutPage from "./pages/user/AboutPage";
import WishlistPage from "./pages/user/WishlistPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrderTrackingPage from "./pages/user/OrderTrackingPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./layouts/admin/AdminRoute";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import PromotionManagementPage from "./pages/admin/PromotionManagementPage";
import ReviewManagementPage from "./pages/admin/ReviewManagementPage";
import Account from "./pages/user/Account";
import DashboardPage from "./pages/admin/DashboardPage";

// Trang Dashboard mẫu để test
const AdminDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm">
      <p className="text-gray-500 text-sm">Doanh số hôm nay</p>
      <h3 className="text-2xl font-black text-gray-800">5,420,000đ</h3>
    </div>
    {/* Các card khác... */}
  </div>
);

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Gọi hàm kiểm tra ngay khi mở app
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7B5D5]"></div>
      </div>
    );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
          <Route path="/user" element={<Account />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Tự động chuyển /admin sang /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="promotions" element={<PromotionManagementPage />} />
          <Route path="reviews" element={<ReviewManagementPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
