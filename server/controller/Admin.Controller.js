const Admin = require("../model/VMAdmin.model");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../utils/generatedAccessToken");
const generateRefreshToken = require("../utils/generatedRefreshToken");

// 🍪 Set refresh token in cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// 🔐 Register
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({ email, password, role });
    res.status(201).json({ message: "Admin registered", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    const newAccessToken = generateAccessToken(admin._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// 🚪 Logout
exports.logoutAdmin = async(req, res) => {
  try {
    const userId = req.user.id; // Assuming you decode it earlier
    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};


// 👤 Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  res.json(admin);
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password -refresh_token");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
