const jwt = require("jsonwebtoken");
const UserModel = require("../model/VMUsermodel");
const generatedAccessToken = require("../utils/generatedAccessToken");


// const generateReferralCode = require("../utils/generateReferralCode");

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // 1️⃣ Generate referral code for THIS user
//     const referralCode = generateReferralCode(name);

//     // 2️⃣ Check if user came via referral link
//     let referredBy = null;

//     if (req.body.referredCode) {
//       const refUser = await UserModel.findOne({
//         referralCode: req.body.referredCode
//       });

//       if (refUser) {
//         referredBy = refUser._id;
//       }
//     }

//     // 3️⃣ Create user
//     const user = new UserModel({
//       name,
//       email,
//       password,
//       referralCode,
//       referredBy
//     });

//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       referralCode: user.referralCode
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed"
//     });
//   }
// };




exports.refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.userRefreshToken;

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





