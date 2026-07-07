import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../utils/api";

const Login = () => {
  const [passVisible, setPassVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter email and password." });
      return;
    }

    try {
      const res = await postData("/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.adminToken);
      localStorage.setItem("name", res.admin.role);

      setMessage({ type: "success", text: "Login successful!" });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-gray-400 w-full max-w-md p-8 rounded-xl shadow-md">
          <div className="text-center mb-6">
            <img
              className="h-10 mx-auto mb-2"
              src="/logo_VM.png"
              alt="Logo"
            />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>

          {message.text && (
            <div
              className={`mb-4 text-sm px-4 py-2 rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              className="w-full p-2 text-black rounded-lg bg-white placeholder-gray-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex items-center bg-white rounded-lg">
              <input
                className="w-full p-2 text-black bg-transparent focus:outline-none"
                type={passVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                onClick={() => setPassVisible(!passVisible)}
                className="p-2 cursor-pointer text-black"
              >
                {passVisible ? <FaRegEye /> : <IoEyeOff />}
              </div>
            </div>

            <div className="text-right text-sm">
              <Link to="/ForgetPassword" className="hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-2 rounded-lg"
            >
              Login
            </button>

            
          </form>
        </div>
      </div>

      {/* Right Side - Illustrations */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center">
        <img
          className="absolute top-20 max-h-[400px] border-2 border-black rounded-xl"
          src="/signinpage.png"
          alt="Signin Illustration"
        />
        <img
          className="absolute bottom-10 right-8 max-h-[300px] border-2 border-black rounded-xl"
          src="/barsemple.png"
          alt="Bar Illustration"
        />
      </div>
    </div>
  );
};

export default Login;
