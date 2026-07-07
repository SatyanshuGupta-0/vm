import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const ChangePassword = () => {
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const hasResetToken = sessionStorage.getItem("resetToken");
  const isLoggedInFlow = !!localStorage.getItem("accesstoken");

  const token = hasResetToken
    ? sessionStorage.getItem("resetToken")
    : localStorage.getItem("accesstoken");

  if (hasResetToken) {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
  }

  const displayMessage = (msg, color = "red") => {
    if (color === "red") setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleForgetPassword = async () => {
    if (!email) return displayMessage("Please enter your email.");

    localStorage.setItem("userEmail", email);
    localStorage.setItem("actionType", "forget-Password");

    setIsLoading(true);
    try {
      const res = await postData("/api/user/forgot-password", { email });
      if (res.success) {
        displayMessage(res.message, "green");
        setTimeout(() => navigate("/OTPVerification"), 1000);
      } else {
        displayMessage(res.message || "Something went wrong.");
      }
    } catch (err) {
      displayMessage(err?.message || "Error during password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token not found. Please log in or verify OTP.");
      return;
    }

    if (
      !newPassword ||
      !confirmPassword ||
      (isLoggedInFlow && !hasResetToken && !currentPassword)
    ) {
      return setError("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setIsLoading(true);
    try {
      const endpoint = hasResetToken
        ? "/api/user/reset-password"
        :  "/api/user/update-password";

      const payload =
        !hasResetToken && isLoggedInFlow
          ? { currentPassword, newPassword, confirmPassword }
          : { email, newPassword, confirmPassword };

      const response = await postData(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setSuccess(response.message || "Password changed successfully!");
        if (hasResetToken) sessionStorage.removeItem("resetToken");

        setTimeout(() => {
          navigate(isLoggedInFlow ? "/profile" : "/login");
        }, 1000);
      } else {
        setError(response.message || "Password change failed.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormIncomplete =
    !newPassword ||
    !confirmPassword ||
    (isLoggedInFlow && !hasResetToken && !currentPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="md:w-96 xs:w-80 p-8 bg-white shadow-lg rounded-lg border-2 border-black border-opacity-5">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLoggedInFlow ? "Update Password" : "Reset Password"}
        </h2>

        {hasResetToken && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
        )}

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}

        <form onSubmit={handleSubmit}>
          {isLoggedInFlow && !hasResetToken && (
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-semibold">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-semibold">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-end mb-4">
            <span
              onClick={handleForgetPassword}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Forget Password?
            </span>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isFormIncomplete || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isFormIncomplete || isLoading}
          >
            {isLoggedInFlow ? "Update Password" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
