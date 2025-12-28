import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import errorIcon from "../../assets/auth/mark.png";
import mailIcon from "../../assets/auth/mail.png";
import blockIcon from "../../assets/auth/locked-computer.png";

import { http } from "../../libs/http.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmedPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState(false);

  useEffect(() => {
    setMatchPassword(true);
  }, [formData]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmedPassword) {
      setMatchPassword(false);
      return;
    }

    try {
      const response = await http.post("/auth/register", {
        name: formData.name || formData.username,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone || "0000000000",
      });

      if (response.data.success) {
        toast.success(response.data.message); // "Đăng ký thành công! Vui lòng kiểm tra email..."
        navigate("/verify-email"); // Chuyển hướng người dùng đến trang thông báo kiểm tra email
      }
    } catch (error) {
      // Hiển thị lỗi từ server (ví dụ: Email đã tồn tại)
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col items-center my-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
        Get Started
      </h2>
      <p className="text-gray-500 mt-2 text-sm text-center">
        Create your free account now
      </p>

      <form className="mt-6 w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="ml-1 font-semibold text-gray-700 text-xs md:text-sm">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={mailIcon}
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              name="email"
              type="text"
              placeholder="name@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="ml-1 font-semibold text-gray-700 text-xs md:text-sm">
            Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={mailIcon}
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              name="username"
              type="text"
              placeholder="Choose a username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="ml-1 font-semibold text-gray-700 text-xs md:text-sm">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={blockIcon}
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="ml-1 font-semibold text-gray-700 text-xs md:text-sm">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={blockIcon}
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              name="confirmedPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) =>
                setFormData({ ...formData, confirmedPassword: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Error & Show Password */}
        <div className="flex justify-start items-center text-xs">
          {!matchPassword ? (
            <div className="flex gap-1 items-center text-red-500 animate-pulse">
              <img className="w-3 h-3" src={errorIcon} /> Passwords do not match
            </div>
          ) : (
            <div></div>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
            <input
              type="checkbox"
              className="accent-[#F88379] w-3.5 h-3.5"
              onChange={(e) => setShowPassword(e.target.checked)}
            />{" "}
            Show password
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3.5 rounded-xl text-white bg-[#F88379] font-bold text-lg hover:bg-[#ff7065] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          Register
        </button>

        {/* Terms */}
        <div className="flex gap-2 items-start justify-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="accent-[#F88379] mt-1"
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-500 leading-tight cursor-pointer"
          >
            I agree to the{" "}
            <span className="text-[#F88379] font-semibold hover:underline">
              Terms of Service
            </span>{" "}
            &{" "}
            <span className="text-[#F88379] font-semibold hover:underline">
              Privacy Policy
            </span>
          </label>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-[#F88379] font-bold cursor-pointer hover:underline"
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default RegisterPage;
