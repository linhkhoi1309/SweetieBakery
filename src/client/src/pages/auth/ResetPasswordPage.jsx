import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import errorIcon from "../../assets/auth/mark.png";
import mailIcon from "../../assets/auth/mail.png";
import blockIcon from "../../assets/auth/locked-computer.png";

import { toast } from "react-hot-toast";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState(false);

  useEffect(() => {
    setMatchPassword(true);
  }, [formData]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmedPassword) {
      setMatchPassword(false);
      return;
    }

    toast.success("Password reset successfully!");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="w-full max-w-[70%] p-6 bg-white rounded-4xl shadow-2xl flex flex-col items-center justify-center">
      {/* Title */}
      <h2 className="mt-8 text-center text-4xl font-semibold">
        Reset Your Password
      </h2>

      {/* Login Form */}
      <form
        className="mt-6 w-[70%] flex flex-col gap-y-3"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-1.5">
          <label className="ml-2 font-bold" htmlFor="password">
            New Password
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
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label className="ml-2 font-bold" htmlFor="confirmedPassword">
            Confirm New Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3  flex flex-col justify-center items-center">
              <img className="w-5 h-5" src={blockIcon} alt="" />
            </div>
            <input
              className="w-full pl-10 border rounded-md p-2 border-[#F88379]"
              name="password"
              id="confirmedPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) =>
                setFormData({ ...formData, confirmedPassword: e.target.value })
              }
              required
            />
          </div>
        </div>
        {!matchPassword ? (
          <div className="ml-2 flex gap-x-2 items-center">
            <img className="w-4 h-4" src={errorIcon} alt="" />
            <p className="text-gray-400">Passwords do not match.</p>
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
        <button
          type="submit"
          className="mt-3 p-4 rounded-2xl text-white text-xl font-semibold bg-[#F88379]"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
