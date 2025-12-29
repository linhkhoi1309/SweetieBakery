import { create } from "zustand";
// import axios from "axios"; // Tạm thời comment axios vì đang mock data
import toast from "react-hot-toast";

import { MOCK_USERS, MOCK_TOKEN } from "../data/mockUserData.js";
import { http } from "../libs/http.js";

//const API_URL = "http://localhost:5000/auth";
//const USER_API_URL = "http://localhost:5000/users"; // Thêm URL cho user profile

//axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isVerifying: false,

  // --- 1. ĐĂNG KÝ  ---
  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      // Chỉ trả về message thành công, chưa có user/token
      // const res = await axios.post(`${API_URL}/register`, userData);

      // Giả lập độ trễ mạng 1 giây
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Logic kiểm tra giả: Nếu email chứa "fail" thì báo lỗi
      if (userData.email.includes("fail")) {
        throw new Error("Email này đã tồn tại (Mock Error)");
      }

      toast.success(
        res.data.message || "Đăng ký thành công! Hãy kiểm tra email."
      );

      // Quan trọng: Ở đây KHÔNG set user.
      // Việc chuyển hướng sang trang /verify-email sẽ do Component (RegisterPage) xử lý
      return true; // Trả về true để Component biết mà chuyển trang
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // --- 2. ĐĂNG NHẬP ---
  login: async (loginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await http.post("/auth/login", loginData);

      if (!res.data.success) {
        toast.error("Sai tài khoản hoặc mật khẩu");
        return;
      }

      //localStorage.setItem("token", res.data.token);
      sessionStorage.setItem("token", res.data.token);

      set({ user: res.data.user, isLoggingIn: false });

      toast.success("Đăng nhập thành công!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // --- 3. ĐĂNG XUẤT ---
  logout: async () => {
    // Xóa local trước cho nhanh giao diện
    //localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    set({ user: null });

    toast.success("Hẹn gặp lại bạn sớm!");
  },

  // --- 4. CHECK AUTH (KHI F5 TRANG) ---
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      //const token = localStorage.getItem("token");
      const token = sessionStorage.getItem("token");

      // Nếu không có token, dừng kiểm tra ngay lập tức
      if (!token) {
        set({ user: null, isCheckingAuth: false });
        return;
      }

      // Gọi API lấy thông tin cá nhân (Profile) của User dựa trên token
      const res = await http.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Cập nhật user thật từ Database vào Store
        set({ user: res.data.user });
      } else {
        // Nếu API trả về không thành công (token hỏng/hết hạn)
        //localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        set({ user: null });
      }
    } catch (error) {
      console.error("Phiên đăng nhập hết hạn hoặc lỗi kết nối:", error.message);
      //localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      set({ user: null });
    } finally {
      // Phải luôn chuyển về false để AdminRoute ngừng render Loading
      set({ isCheckingAuth: false });
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ isVerifying: true });
    try {
      // 1. Gọi API xác thực
      const res = await http.post("/auth/verify-email", {
        token: verificationCode,
      });

      // 2. Lưu token vào localStorage
      //localStorage.setItem("token", res.data.token);
      sessionStorage.setItem("token", res.data.token);

      // 3. Cập nhật user vào Store (Đây là lúc user chính thức đăng nhập)
      set({ user: res.data.user, isVerifying: false });

      toast.success("Xác thực thành công!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Xác thực thất bại");
      set({ isVerifying: false });
      return false;
    }
  },
}));
