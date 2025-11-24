import React, { useState } from "react";

import { ArrowLeft } from "lucide-react";
import mailIcon from "../../assets/auth/mail.png";

import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    navigate("/verify-code");
  };

  return (
    <div className="max-w-[50%] p-10 border border-gray-300 bg-white rounded-4xl shadow-2xl flex flex-col items-start justify-center gap-4">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Forgot Password?</h2>
        <p className="text-gray-500">
          Enter your email address and we'll send you a verification code
        </p>
      </div>

      {/* Forgot Form */}
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleForgotPassword}
      >
        {/* Email */}
        <div className="flex flex-col gap-y-1.5">
          <label className="ml-2 font-bold" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3  flex flex-col justify-center items-center">
              <img className="w-5 h-5" src={mailIcon} alt="" />
            </div>
            <input
              className="w-full pl-10 border rounded-md p-2 border-[#F88379]"
              name="email"
              id="email"
              type="text"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white font-bold text-lg bg-[#F88379] hover:bg-[#F88379]/85 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          Send Verification Code
        </button>
      </form>

      <Link
        to="/login"
        className="w-full text-sm flex gap-1 items-center justify-center hover:underline"
      >
        <ArrowLeft
          className="size-4 group-hover:-translate-x-0.5 transition duration-200"
          strokeWidth={1}
        />
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;
