import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const Login = () => {
  const [pass, setPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState({ msg: "", color: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const showPass = () => setPass((prev) => !prev);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const displayMessage = (msg, color = "red") => {
    setErrMessage({ msg, color });
    setTimeout(() => setErrMessage({ msg: "", color: "" }), 3000);
  };

  const handleForgetPassword = async () => {
    if (!email) return displayMessage("Please enter your email.");

    localStorage.setItem("userEmail", email);
    localStorage.setItem("actionType", "forget-Password");

    try {
      const res = await postData("/api/user/forgot-password", { email });
      if (res.success) {
        displayMessage(res.message, "white");
        setTimeout(() => navigate("/OTPVerification"), 1000);
      } else {
        displayMessage(res.message || "Something went wrong.");
      }
    } catch (err) {
      displayMessage(err?.message || "Error during password reset.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return displayMessage("Please fill in all fields.");

    setIsLoading(true);
    try {
      const res = await postData("/api/user/login", { email, password }, { withCredentials: true });

      if (res.success) {
        displayMessage("Login successful!", "green");
        localStorage.setItem("accesstoken", res?.data?.accessToken);
        localStorage.setItem("referralCode", res?.data?.referralCode);
        localStorage.setItem("userEmail", email);
        setTimeout(() => navigate("/"), 1000);
      } else {
        displayMessage(res.message || "Login failed.");
      }
    } catch (err) {
      displayMessage(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    const googleToken = response?.credential;
    if (!googleToken) return displayMessage("Google login failed.");

    setIsLoading(true);
    try {
      const res = await postData("/api/user/google-auth", { token: googleToken }, { withCredentials: true });

      if (res.success) {
        displayMessage("Google login successful!", "green");
        localStorage.setItem("accesstoken", res?.data?.accessToken);
        setTimeout(() => navigate("/"), 1000);
      } else {
        displayMessage(res.message || "Google login failed.");
      }
    } catch (err) {
      displayMessage(err?.message || "Google login error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // ✅ Use environment variable
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(document.getElementById("googleSignInDiv"), {
        theme: "outline",
        size: "large",
        width: 240,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-white backdrop-blur-md z-0"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{
          background: `
            radial-gradient(circle at top right, rgba(43, 123, 223, 0.6), transparent 70%),
            linear-gradient(120deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.8) 50%)
          `,
        }}
      >
        <div className="text-center">
          <img src="/logo_VM.png" alt="Logo" className="h-12 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white">Login to Your Account</h1>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="relative">
            <input
              type={pass ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div
              onClick={showPass}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {pass ? <FaRegEye /> : <IoEyeOff />}
            </div>
          </div>

          <div className="text-right">
            <span
              onClick={handleForgetPassword}
              className="text-sm text-blue-300 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          {errMessage.msg && (
            <div
              className={`py-2 ${errMessage.color === "green" ? "bg-green-100" : "bg-red-100"
                }`}
            >
              <p className="text-sm text-center font-medium" style={{ color: errMessage.color }}>
                {errMessage.msg}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white font-medium rounded-lg transition-all duration-200 ${isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-white mt-3">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Signup
            </Link>
          </div>

          <div className="mt-6 text-center">
            <div id="googleSignInDiv" className="flex justify-center"></div>
          </div>

          <Link to="/" className="block text-center text-sm text-white pt-3 hover:underline">
            Skip
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
