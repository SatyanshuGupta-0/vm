import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleVerify(otp.join(""));
    }
  };

  const handleVerify = async (otpCode = otp.join("")) => {
    if (otpCode.length !== 6) {
      setMessage("Please enter the full 6-digit OTP.");
      setIsSuccess(false);
      return;
    }

    const actionType = localStorage.getItem("actionType");
    const apiUrl =
      actionType === "forget-Password"
        ? "/api/user/verify-forgot-password-otp"
        : "/api/user/verifyEmail";

    try {
      const result = await postData(apiUrl, { email, otp: otpCode });

      if (result.success) {
        setMessage("OTP verified successfully!");
        setIsSuccess(true);

        if (actionType === "forget-Password" && result.resetToken) {
          sessionStorage.setItem("resetToken", result.resetToken);
        }

        localStorage.removeItem("actionType");

        setTimeout(() => {
          navigate(actionType === "forget-Password" ? "/changepassword" : "/login");
        }, 1500);
      } else {
        setMessage(result.message || "Verification failed. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Something went wrong. Please try again later.");
      setIsSuccess(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4"
     style={{
      background: `
        radial-gradient(circle at top right, rgba(43, 123, 223, 0.6), transparent 70%),
        linear-gradient(120deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.8) 50%)
      `,
    }}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">OTP Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold shadow-md"
          >
            Verify OTP
          </button>
        </form>

        {message && (
          <div className={`mt-6 text-center font-medium ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
