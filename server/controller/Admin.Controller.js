const Admin = require("../model/VMAdmin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const generateAccessToken = require("../utils/generatedAccessToken");
const generateRefreshToken = require("../utils/generatedRefreshToken");

// 🍪 Set Refresh Token Cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// 🍪 Set Access Token Cookie
const setAccessTokenCookie = (res, token) => {
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
   maxAge: 1 * 60 * 1000,
  });
};

// 🧾 Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
        name: newAdmin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const adminToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id); // ✅ Fix here

    user.refresh_token = refreshToken;
    user.last_login_date = new Date();
    await user.save(); // ✅ Now refresh_token is a string, not a Promise

    setAccessTokenCookie(res, adminToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      message: "Login successful",
      success: true,
      adminToken: adminToken,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


exports.refreshToken = async (req, res) => {
  console.log("🌐 Cookies:", req.cookies); // 🔍 Check if refreshToken is present

  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN);
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refresh_token !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(admin._id);

    res.cookie("adminToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 1 * 60 * 1000,
    });

    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};


// 🚪 Logout Admin
exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { path: "/", sameSite: "None", secure: true });
    res.clearCookie("accessToken", { path: "/", sameSite: "None", secure: true });

    const { id } = req.body;
    if (id) await Admin.findByIdAndUpdate(id, { refresh_token: null });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// 👤 Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 📋 All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📩 Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Email not registered" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate reset token" });
  }
};

// 🔁 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).json({ message: "Token invalid or expired" });

    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed" });
  }
};
