import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // used instead of postData for full control
import { FaRegEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { postData } from "../utils/api";

const AdminRegister = () => {
  const [showPass, setShowPass] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: [],
  });
  
  const navigate = useNavigate();
  const togglePassword = () => setShowPass(!showPass);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      const selectedRoles = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setAdminData((prev) => ({ ...prev, role: selectedRoles }));
    } else {
      setAdminData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = adminData;
    
    if (!name || !email || !password || role.length === 0) {
      alert("Please fill all fields including role");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Unauthorized: Please login as superadmin.");
        return;
      }
      
      const response = await postData(
        "/api/admin/registers",
        { name, email, password, role: role[0] }, // sending a single role string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      
      alert("Admin registered successfully!");
      navigate("/");
    } catch (err) {
     
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-[90%] max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Admin Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={adminData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={adminData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          required
        />

        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={adminData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded pr-10"
            required
            autoComplete="new-password"
          />
          <div
            onClick={togglePassword}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showPass ? <FaRegEye /> : <IoEyeOff />}
          </div>
        </div>

        <label className="block text-black mb-1 font-medium">Select Role</label>
        <select
          name="role"
          value={adminData.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        >
          <option value="">Select a role</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="support">Support</option>
          <option value="accountant">Accountant</option>
          <option value="hr">HR</option>
          <option value="auditor">Auditor</option>
          <option value="editor">Editor</option>
          <option value="vendor">Vendor</option>
          <option value="shopkeeper">shopkeeper</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
