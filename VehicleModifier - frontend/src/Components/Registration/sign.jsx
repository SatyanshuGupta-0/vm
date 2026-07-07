// import { useState, useEffect } from "react";
// import { FaRegEye } from "react-icons/fa";
// import { IoEyeOff } from "react-icons/io5";
// import { useNavigate, Link } from "react-router-dom";
// import { postData } from "../../utils/api";

// const Signup = ({ closebox, showbox }) => {
//   const navigate = useNavigate();
//   const [pass, setPass] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [signupInfo, setSignupInfo] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [errMessage, setErrMessage] = useState({ msg: "", color: "" });

//   const togglePassVisibility = () => setPass((prev) => !prev);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSignupInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const displayMessage = (msg, color = "red") => {
//     setErrMessage({ msg, color });
//     setTimeout(() => setErrMessage({ msg: "", color: "" }), 3000);
//   };

//   const isFormFilled = Object.values(signupInfo).every((el) => el.trim() !== "");

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { name, email, password } = signupInfo;

//     if (!name || !email || !password) {
//       return displayMessage("Name, email, and password are required");
//     }

//     setIsLoading(true);
//     try {
//       localStorage.setItem("userEmail", email);
//       const res = await postData("/api/user/register", signupInfo);

//       if (res?.success) {
//         if (res.message.includes("not verified")) {
//           displayMessage("OTP resent. Please verify your email.", "yellow");
//           setTimeout(() => navigate("/OTPVerification"), 1000);
//         } else {
//           displayMessage(res.message || "Signup successful!", "white");
//           setTimeout(() => navigate("/OTPVerification"), 1000);
//         }
//       } else {
//         if (res.message.includes("already registered and verified")) {
//           displayMessage("Already registered. Please login.", "white");
//           setTimeout(() => navigate("/login"), 1500);
//         } else {
//           displayMessage(res?.message || "Signup failed", "red");
//         }
//       }
//     } catch (err) {
//       displayMessage("Something went wrong", "red");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (response) => {
//     const token = response.credential;
//     try {
//       const res = await postData("/api/user/google-auth", { token }, { withCredentials: true });

//       if (res?.success) {
//         displayMessage("Google Signup Successful", "white");
//         localStorage.setItem("accesstoken", res.token);
//         navigate("/");
//       } else {
//         displayMessage(res?.message || "Google signup failed", "red");
//       }
//     } catch (err) {
//       displayMessage("Google login error", "red");
//     }
//   };

//   useEffect(() => {
//   if (window.google) {
//     window.google.accounts.id.initialize({
//       client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//       callback: handleGoogleSuccess,
//       auto_select: false,
//       ux_mode: "popup",
//     });

//     window.google.accounts.id.renderButton(
//       document.getElementById("googleSignupDiv"),
//       {
//         theme: "outline",
//         size: "large",
//         type: "standard",           // ✅ default Google look
//         text: "continue_with",      // ✅ Shows: Continue with Google
//         shape: "pill",              // ✅ Optional: pill/rectangular/circle
//         logo_alignment: "left",     // Optional
//         width: 250,
//       }
//     );
//   }
// }, []);


//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
//       <div className="absolute inset-0 bg-white backdrop-blur-md z-0"></div>

//       <div
//         className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-xl"
//         style={{
//           background: `
//             radial-gradient(circle at top right, rgba(43, 123, 223, 0.6), transparent 70%),
//             linear-gradient(120deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.8) 50%)
//           `,
//         }}
//       >
//         <div className="text-center">
//           <img src="/logo_VM.png" alt="Logo" className="h-12 mx-auto mb-3" />
//           <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
//         </div>

//         <form onSubmit={handleSignup} className="mt-6 space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={signupInfo.name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={signupInfo.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <div className="relative">
//             <input
//               type={pass ? "text" : "password"}
//               name="password"
//               placeholder="Password (min 6 characters)"
//               value={signupInfo.password}
//               onChange={handleChange}
//               minLength={6}
//               required
//               className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div
//               onClick={togglePassVisibility}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 cursor-pointer"
//             >
//               {pass ? <FaRegEye /> : <IoEyeOff />}
//             </div>
//           </div>

//           {errMessage.msg && (
//             <p className="text-sm text-center font-medium" style={{ color: errMessage.color }}>
//               {errMessage.msg}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={!isFormFilled || isLoading}
//             className={`w-full py-2 text-white font-medium rounded-lg transition-all duration-200 ${
//               isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {isLoading ? "Signing up..." : "Signup"}
//           </button>

//           <div className="flex items-center gap-2 justify-center text-white my-2">
//             <div className="h-px flex-1 bg-white/40" />
//             <span className="text-sm">or</span>
//             <div className="h-px flex-1 bg-white/40" />
//           </div>

//           <div id="googleSignupDiv" className="flex justify-center" />

//           <div className="text-center text-white mt-3">
//             Already have an account?{" "}
//             <Link to="/login">
//               <span
//                 onClick={() => showbox("login")}
//                 className="text-blue-300 hover:underline cursor-pointer"
//               >
//                 Login
//               </span>
//             </Link>
//           </div>

//           <Link to="/">
//             <p
//               onClick={() => closebox("")}
//               className="block text-center text-sm text-white pt-3 hover:underline"
//             >
//               Skip
//             </p>
//           </Link>
//         </form>
//       </div>

//       <div className="hidden lg:flex flex-col gap-6 ml-8 z-10">
//         <img src="/logo_VM.png" alt="Signup Visual" className="w-[400px]" />
//       </div>
//     </div>
//   );
// };

// export default Signup;
import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { postData } from "../../utils/api";

const Signup = ({ closebox, showbox }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pass, setPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });
  const [errMessage, setErrMessage] = useState({ msg: "", color: "" });

  // Toggle password visibility
  const togglePassVisibility = () => setPass((prev) => !prev);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Display message
  const displayMessage = (msg, color = "red") => {
    setErrMessage({ msg, color });
    setTimeout(() => setErrMessage({ msg: "", color: "" }), 3000);
  };

  // Check if form is filled
  const isFormFilled = Object.values(signupInfo)
    .filter((v, i) => i !== 3) // exclude referralCode
    .every((el) => el.trim() !== "");

  // Get referral code from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const refCode = queryParams.get("ref");
    if (refCode) {
      setSignupInfo((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, referralCode } = signupInfo;

    if (!name || !email || !password) {
      return displayMessage("Name, email, and password are required");
    }

    setIsLoading(true);
    try {
      localStorage.setItem("userEmail", email);
      const res = await postData("/api/user/register", signupInfo);
      console.log("Signup Response:", res);

      if (res?.success) {
        displayMessage(res.message || "Signup successful!", "white");
        navigate("/OTPVerification");
      } else {
        if (res?.message?.includes("already registered")) {
          displayMessage("Already registered. Please login.", "white");
          navigate("/login");
        } else {
          displayMessage(res?.message || "Signup failed");
        }
      }
    } catch {
      displayMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup
  const handleGoogleSuccess = async (response) => {
    try {
      const res = await postData(
        "/api/user/google-auth",
        { token: response.credential },
        { withCredentials: true }
      );

      if (res?.success) {
        localStorage.setItem("accesstoken", res.token);
        navigate("/");
      } else {
        displayMessage(res?.message || "Google signup failed");
      }
    } catch {
      displayMessage("Google login error");
    }
  };

  useEffect(() => {
    if (!window.google) return;

    const container = document.getElementById("googleSignupDiv");
    if (container) container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSuccess,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 250,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-0"></div>
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-xl"
        style={{
          background: `
            radial-gradient(circle at top right, rgba(43, 123, 223, 0.6), transparent 70%),
            linear-gradient(120deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.8) 50%)
          `,
        }}
      >
        <div className="text-center mb-6">
          <img src="/logo_VM.png" alt="Logo" className="h-12 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-gray-300 mt-1 text-sm">
            Join us and enjoy exclusive benefits!
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={signupInfo.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={signupInfo.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <div className="relative">
            <input
              type={pass ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 chars)"
              value={signupInfo.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
            <div
              onClick={togglePassVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {pass ? <FaRegEye /> : <IoEyeOff />}
            </div>
          </div>

          <input
            name="referralCode"
            placeholder="Referral Code (Optional)"
            value={signupInfo.referralCode}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />

          {errMessage.msg && (
            <p className="text-sm text-center font-medium" style={{ color: errMessage.color }}>
              {errMessage.msg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormFilled || isLoading}
            className={`w-full py-2 text-white font-medium rounded-lg transition-all duration-200 ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>

          <div className="flex items-center gap-2 justify-center text-white my-2">
            <div className="h-px flex-1 bg-white/40" />
            <span className="text-sm">or</span>
            <div className="h-px flex-1 bg-white/40" />
          </div>

          <div id="googleSignupDiv" className="flex justify-center" />

          <div className="text-center text-white mt-3">
            Already have an account?{" "}
            <Link to="/login">
              <span onClick={() => showbox("login")} className="text-blue-300 hover:underline cursor-pointer">
                Login
              </span>
            </Link>
          </div>

          <Link to="/">
            <p onClick={() => closebox("")} className="block text-center text-sm text-white pt-3 hover:underline">
              Skip
            </p>
          </Link>
        </form>
      </div>

      <div className="hidden lg:flex flex-col gap-6 ml-8 z-10">
        <img src="/logo_VM.png" alt="Signup Visual" className="w-[400px]" />
      </div>
    </div>
  );
};

export default Signup;

