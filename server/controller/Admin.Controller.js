
const Admin = require("../model/VMAdmin.model");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../utils/generatedAccessToken");
const generateRefreshToken = require("../utils/generatedRefreshToken");

// 🍪 Set refresh token in cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// 🔐 Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({ name, email, password, role });
    res.status(201).json({ message: "Admin registered", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login Admin
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
// exports.refreshToken = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "No refresh token" });

//     const decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN,);
//     const admin = await Admin.findById(decoded.id);
//     if (!admin) return res.status(401).json({ message: "Admin not found" });

//     const newAccessToken = generateAccessToken(admin._id);
//     res.json({ accessToken: newAccessToken });
//   } catch (err) {
//     res.status(403).json({ message: "Invalid or expired refresh token" });
//   }
// };
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = await generatedAccessToken(admin._id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/", // ✅ Make sure this is set
    });

    return res.json({ success: true, accessToken: newAccessToken });
 // ✅ Don't send token to frontend
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
// 🚪 Logout Admin
exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// 👤 Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

// 📋 Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Email not registered" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save({ validateBeforeSave: false });

    // Normally you'd send email; for now return it in response (frontend can use it)
    res.status(200).json({
      message: "Reset token generated",
      resetToken, // NOTE: For testing or API client usage only
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating reset token" });
  }
};

// 🔄 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed" });
  }
};

