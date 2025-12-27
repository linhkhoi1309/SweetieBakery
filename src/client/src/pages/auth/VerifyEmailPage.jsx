import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/useAuthStore.js";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Paste multiple characters
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else if (/^\d*$/.test(value)) {
      newCode[index] = value;
      setCode(newCode);

      // Focus to the next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    const verificationCode = code.join(""); // Gộp 6 ô input thành 1 chuỗi

    const success = await verifyEmail(verificationCode);

    if (success) {
      navigate("/");
    } else {
      setCode(["", "", "", "", "", ""]);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    toast.success("Resent code successfully");
  };

  // Auto-submit when all inputs filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleVerifyCode();
    }
  }, [code]);

  return (
    <div className="max-w-[70%] p-10 bg-white rounded-4xl shadow-2xl">
      <div className="flex flex-col items-start justify-center">
        <div className="flex flex-col gap-y-1">
          {/* Title */}
          <h2 className="text-3xl font-semibold">Verify Your Email</h2>
          {/* Sub-title */}
          <p className="text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleVerifyCode}>
          <div className="flex gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="size-12 text-center text-2xl font-bold bg-gray-400/50 rounded-lg border-2 border-gray-700 focus-visible:ring-2 focus-visible:ring-black/50"
                required
              />
            ))}
          </div>

          <div className="text-sm flex gap-x-2 items-center justify-center">
            Didn't receive the code?
            <button
              className="text-[#F88379] hover:underline hover:cursor-pointer"
              onClick={handleResendCode}
            >
              Resend
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-[#F88379] font-bold text-lg rounded-lg cursor-pointer disabled:cursor-not-allowed"
            disabled={code.some((digit) => !digit)}
          >
            Verify Email
          </button>
        </form>

        <form action=""></form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
