import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="w-full max-w-[70%] p-6 bg-white rounded-4xl shadow-2xl flex flex-col items-center justify-center">
      {/* Title */}
      <h2 className="mt-16 text-center text-4xl font-semibold">
        Hello, Welcome back!
      </h2>

      {/* Login Form */}
      <form
        className="mt-16 w-[70%] flex flex-col gap-y-3"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-1.5">
          <label className="ml-2 font-bold" htmlFor="email">
            Username/Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3  flex flex-col justify-center items-center pointer-events-none">
              <img className="w-5 h-5" src={mailIcon} alt="" />
            </div>
            <input
              className="w-full pl-10 border rounded-md p-2 border-[#F88379]"
              name="email"
              id="email"
              type="text"
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label className="ml-2 font-bold" htmlFor="password">
            Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3  flex flex-col justify-center items-center">
              <img className="w-5 h-5" src={blockIcon} alt="" />
            </div>
            <input
              className="w-full pl-10 border rounded-md p-2 border-[#F88379]"
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          {wrongPassword ? (
            <div className="ml-2 flex gap-x-2 items-center">
              <img className="w-4 h-4" src={errorIcon} alt="" />
              <p className="text-gray-400">Wrong password</p>
            </div>
          ) : (
            <></>
          )}
          <div className="flex gap-x-1">
            <input
              type="checkbox"
              id="showPassword"
              onChange={(e) => {
                setShowPassword(e.target.checked);
              }}
            />
            <label htmlFor="showPassword">Show password</label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 p-4 rounded-2xl text-white bg-[#F88379]"
        >
          Login
        </button>
      </form>

      <div className="mt-2 text-[14px]">
        Forgot your password?{" "}
        <span
          onClick={handleForgotPasswordClick}
          className="italic text-[#F88379] hover:cursor-pointer hover:underline"
        >
          Reset password
        </span>
      </div>

      <div className="mt-10 text-[14px]">
        Don't have an account?{" "}
        <span
          onClick={handleRegisterClick}
          className="italic text-[#F88379] hover:cursor-pointer hover:underline"
        >
          Register
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
