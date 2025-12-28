import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import errorIcon from "../../assets/auth/mark.png";
import mailIcon from "../../assets/auth/mail.png";
import blockIcon from "../../assets/auth/locked-computer.png";

import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore.js";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(formData);

    if (success) {
      navigate("/"); // Chuyển về trang chủ nếu thành công
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Please login to your account
        </p>
      </div>

      {/* Form */}
      <form
        className="mt-6 md:mt-8 w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 font-semibold text-gray-700 text-sm">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={mailIcon}
                alt=""
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              type="text"
              placeholder="Enter your email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 font-semibold text-gray-700 text-sm">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                src={blockIcon}
                alt=""
              />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex justify-start items-center mt-1">
            {wrongPassword ? (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <img src={errorIcon} className="w-3 h-3" /> Wrong password
              </span>
            ) : (
              <span></span>
            )}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-gray-700">
              <input
                type="checkbox"
                className="accent-[#F88379]"
                onChange={(e) => setShowPassword(e.target.checked)}
              />{" "}
              Show password
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl text-white bg-[#F88379] font-bold text-lg hover:bg-[#ff7065] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Login
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-600">
        <div>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#F88379] font-bold cursor-pointer hover:underline"
          >
            Register now
          </span>
        </div>
      </div>

      <Link
        to="/"
        className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#F88379] transition-colors group font-medium"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home Page
      </Link>
    </div>
  );
};

export default LoginPage;
