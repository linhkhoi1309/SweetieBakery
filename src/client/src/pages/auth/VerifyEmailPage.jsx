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
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Verify Email
        </h2>
        <p className="text-gray-500 text-sm">
          We've sent a 6-digit code to your email.
          <br className="hidden md:block" /> Please enter it below.
        </p>
      </div>

      <form
        className="mt-8 flex flex-col gap-6 w-full"
        onSubmit={handleVerifyCode}
      >
        {/* Input Grid: Responsive spacing */}
        <div className="flex justify-between gap-1 md:gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              // Mobile: w-10 h-12 | Desktop: w-12 h-14
              className="w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-gray-200 rounded-lg border-2 border-gray-200 focus:border-[#F88379] focus:ring-4 focus:ring-[#F88379]/10 outline-none transition-all"
              required
              inputMode="numeric"
            />
          ))}
        </div>

        <div className="text-sm flex gap-x-2 items-center justify-center text-gray-600">
          Didn't receive code?
          <button
            className="text-[#F88379] font-bold hover:underline"
            onClick={handleResendCode}
          >
            Resend
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl text-white bg-[#F88379] font-bold text-lg hover:bg-[#ff7065] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={code.some((digit) => !digit)}
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
