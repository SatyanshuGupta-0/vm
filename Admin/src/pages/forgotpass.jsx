import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ResetOrForgotPassword() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState("email"); // email → otp → reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsLoggedIn(!!token);
  }, []);

  // 🔄 Reset Password (Logged In)
  const handleReset = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `/api/admin/reset-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  // ✉️ Send OTP (Forgot)
  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`/api/admin/forgot-password`, { email });
      alert(res.data.message);
      setStep("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`/api/admin/verify-otp`, { email, otp });
      alert(res.data.message);
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  // 🔑 Set New Password (After OTP)
  const handleForgotReset = async () => {
    try {
      const res = await axios.post(`/api/admin/change-password`, {
        email,
        otp,
        newPassword,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isLoggedIn ? "Reset Password" : "Forgot Password"}
      </h2>

      {!isLoggedIn && step === "email" && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            className="border p-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Send OTP
          </button>
        </>
      )}

      {!isLoggedIn && step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Verify OTP
          </button>
        </>
      )}

      {((!isLoggedIn && step === "reset") || isLoggedIn) && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={isLoggedIn ? handleReset : handleForgotReset}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            {isLoggedIn ? "Reset Password" : "Set New Password"}
          </button>
        </>
      )}
    </div>
  );
}
