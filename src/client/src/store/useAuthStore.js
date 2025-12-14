import { create } from "zustand";
// import axios from "axios"; // Tạm thời comment axios vì đang mock data
import toast from "npm i react-hot-toast";

import { MOCK_USERS, MOCK_TOKEN } from "../data/mockUserData.js";

//const API_URL = "http://localhost:5000/auth";
//const USER_API_URL = "http://localhost:5000/users"; // Thêm URL cho user profile

//axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

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
      //const res = await axios.post(`${API_URL}/login`, loginData);

      // Tìm user trong file mockData
      const foundUser = MOCK_USERS.find(
        (u) => u.email === loginData.email && u.password === loginData.password
      );

      if (!foundUser) {
        throw new Error("Email hoặc mật khẩu không đúng (Mock Check)");
      }

      // API trả về: { success: true, token: "...", user: {...} }
      // Lưu token
      //localStorage.setItem("token", res.data.token);
      localStorage.setItem("token", MOCK_TOKEN);

      // Lưu user vào Store
      //set({ user: res.data.user });
      set({ user: foundUser });

      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // --- 3. ĐĂNG XUẤT ---
  logout: async () => {
    // Xóa local trước cho nhanh giao diện
    localStorage.removeItem("token");
    set({ user: null });

    try {
      //await axios.post(`${API_URL}/logout`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập gọi API logout
      toast.success("Đã đăng xuất");
    } catch (error) {
      // Lỗi logout thường không quan trọng, không cần toast
      console.log("Logout error", error);
    }
  },

  // --- 4. CHECK AUTH (KHI F5 TRANG) ---
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ isCheckingAuth: false, user: null });
        return;
      }

      // Gắn token thủ công vào header
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Gọi API Get Profile
      //const res = await axios.get(`${USER_API_URL}/profile`, config);

      await new Promise((resolve) => setTimeout(resolve, 500));
      const currentUser = MOCK_USERS[0];

      // CẬP NHẬT: Xử lý trường hợp API trả về { success: true, user: {...} }
      // Nếu res.data.user tồn tại thì lấy, nếu không thì lấy res.data
      //set({ user: res.data.user || res.data });
      set({ user: currentUser });
    } catch (error) {
      console.log("Phiên đăng nhập hết hạn hoặc lỗi mạng");
      set({ user: null });
      localStorage.removeItem("token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
