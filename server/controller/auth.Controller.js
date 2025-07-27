const jwt = require("jsonwebtoken");
const UserModel = require("../model/VMUsermodel");
const generatedAccessToken = require("../utils/generatedAccessToken");

exports.refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.userRefreshToken;
console.log(req)
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    const user = await UserModel.findById(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = await generatedAccessToken(user._id);

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

exports.meController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password -refresh_token");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error in meController:", err.message);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};



// const jwt = require("jsonwebtoken");
// const UserModel = require("../model/VMUsermodel");
// const generatedAccessToken = require("../utils/generatedAccessToken");

// exports.refreshTokenController = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "No refresh token provided" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
//     const user = await UserModel.findById(decoded.id);

//     if (!user || user.refresh_token !== refreshToken) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     const newAccessToken = await generatedAccessToken(user._id);

//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//       path: "/", // ✅ Make sure this is set
//     });

//     return res.json({ success: true, accessToken: newAccessToken });
//  // ✅ Don't send token to frontend
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired refresh token" });
//   }
// };

// exports.meController = async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.user.id).select("-password -refresh_token");
//     if (!user) {
//       return res.status(404).json({ message: "User not found", success: false });
//     }
//     return res.status(200).json({ success: true, user });
//   } catch (err) {
//     console.error("Error in meController:", err.message);
//     return res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };
