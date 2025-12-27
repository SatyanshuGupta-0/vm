const UserModel = require("../model/VMUsermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailFun = require("../config/sendEmail");
const { verificationEmail } = require("../utils/verifyEmailTemplate");
const generatedAccessToken = require("../utils/generatedAccessToken");
const generatedRefreshToken = require("../utils/generatedRefreshToken");
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const { response } = require("express");
const { verify } = require("crypto");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing token", success: false });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email_verified, email, name, picture } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified", success: false });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = new UserModel({
        name,
        email,
        password: "", // because Google
        verify_email: true,
        avatar: picture,
        status: "Active",
        role: ["USER"],
      });

      await user.save();
    } else {
      if (user.status !== "Active") {
        return res.status(403).json({
          message: "Account disabled by admin",
          success: false,
        });
      }
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      message: "Google login/register successful",
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error.message || error);
    return res.status(500).json({ message: "Server Error", error: true });
  }
};


// const registerUserController = async (req, res) => {
//   try {
//     const { name, email, password,picture } = req.body;
//     const isGoogleSignup = !password;

//     if (!name || !email || (!password && !isGoogleSignup)) {
//       return res.status(400).json({ message: "Name, email, and password required", success: false });
//     }

//     const existingUser = await UserModel.findOne({ email });

//     // User exists
//     if (existingUser) {
//       if (existingUser.verify_email) {
//         return res.status(400).json({ message: "User already registered. Please login.", success: false });
//       } else {
//         const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//         existingUser.otp = newOtp;
//         existingUser.otpExpires = Date.now() + 600000;
//         await existingUser.save();

//         try {
//           await sendEmailFun(email, "Resend OTP", "", verificationEmail(existingUser.name || "User", newOtp));
//         } catch (err) {
//           console.error("Email send failed:", err);
//         }

//         return res.status(200).json({ message: "Email already registered but not verified. OTP resent.", success: true });
//       }
//     }

//     // New user
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const hashPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt(10)) : "";

//     const newUser = new UserModel({
//       name,
//       email,
//       password: hashPassword,
//       otp: verifyCode,
//       otpExpires: Date.now() + 600000,
//       verify_email: isGoogleSignup ? true : false,
//       avatar: { url: picture || "", publicId: null },
//       role: ["USER"],
//     });

//     await newUser.save();

//     // Regular signup — send email
//     if (!isGoogleSignup) {
//       try {
//         await sendEmailFun(email, "Verify Email", "", verificationEmail(name, verifyCode));
//       } catch (err) {
//         console.error("Email send failed:", err);
//       }

//       let token;
//       try {
//         token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       } catch (err) {
//         console.error("JWT sign failed:", err);
//       }

//       return res.status(201).json({
//         message: "User registered successfully! Please verify your email.",
//         success: true,
//         token: token || null,
//       });
//     }

//     // Google signup — return tokens
//     let accessToken, refreshToken;
//     try {
//       accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
//       refreshToken = jwt.sign({ id: newUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
//       newUser.access_token = accessToken;
//       newUser.refresh_token = refreshToken;
//       newUser.last_login_date = new Date();
//       await newUser.save();
//     } catch (err) {
//       console.error("Google token generation failed:", err);
//       return res.status(500).json({ message: "Token generation failed", success: false });
//     }

//     return res.status(201).json({
//       message: "Google signup successful",
//       success: true,
//       data: {
//         accessToken,
//         refreshToken,
//         user: {
//           _id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//           avatar: newUser.avatar.url,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };
const registerUserController = async (req, res) => {
  try {
    console.log("👉 Register request received");

    const { name, email, password, picture } = req.body;
    const isGoogleSignup = !password;

    if (!name || !email || (!password && !isGoogleSignup)) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    // 🔁 Existing user
    if (existingUser) {
      if (existingUser.verify_email) {
        return res.status(400).json({
          success: false,
          message: "User already registered. Please login.",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 600000;
      await existingUser.save();

      // ✅ SEND RESPONSE FIRST
      res.status(200).json({
        success: true,
        message: "OTP resent to your email",
      });

      // 📧 EMAIL IN BACKGROUND
      setImmediate(async () => {
        await sendEmailFun(
          email,
          "Verify Your Email",
          "",
          verificationEmail(existingUser.name, otp)
          console.log("emial send done")
        );
      });

      return;
    }

    // 🆕 New user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : "";

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 600000,
      verify_email: isGoogleSignup,
      avatar: { url: picture || "", publicId: null },
      role: ["USER"],
    });

    await newUser.save();

    // ✅ REGULAR SIGNUP
    if (!isGoogleSignup) {
      res.status(201).json({
        success: true,
        message: "Registered successfully. OTP sent.",
      });

      // 📧 EMAIL AFTER RESPONSE
      setImmediate(async () => {
        await sendEmailFun(
          email,
          "Verify Your Email",
          "",
          verificationEmail(name, otp)
        );
      });

      return;
    }

    // ✅ GOOGLE SIGNUP
    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    newUser.access_token = accessToken;
    newUser.refresh_token = refreshToken;
    newUser.last_login_date = new Date();
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Google signup successful",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar.url,
        },
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const verifyEmailController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: true, success: false, message: "user not found" });
        }

        const isOtpValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isOtpValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save()
            return res.status(200).json({ success: true, error: false, massage: "Email verified successfully" })
        }
        else if (!isOtpValid) {
            return res.status(400).json({ success: false, error: true, massage: "Invalid OTP" })
        }
        else {
            return res.status(400).json({ success: false, error: true, massage: "OTP expired" })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact Admin for account status",
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return res.status(400).json({
        message: "Your Email is not verified yet. Please verify your email first",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      maxAge: 1000 * 60 * 15, // 15 minutes for accessToken
    };

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 1 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

    return res.json({
      message: "Login successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ Correct way to access user ID

    const cookiesOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    // Clear cookies
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    // Optional: Clear refresh token in DB
    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });
    }

    return res.json({
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

var imagesArr = []
const userAvatarController = async (req, res) => {
    try {
        imagesArr = [];

        const userId = req.userId;
        const image = req.files;
        console.log(image)

        const user = await UserModel.findOne({ _id: userId });

        const imgurl = user.avatar;
        const urlArr = imgurl.split("/");
        const avatar_image = urlArr[urlArr.length - 1];
        const imageName = avatar_image.split(".")[0];

        if (imageName) {
            const res = await cloudinary.uploader.destroy(
                imageName,
                (error, result) => { }
            );

        }


        if (!user) {
            return res.status(500).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,

        };
        for (let i = 0; i < image?.length; i++) {

            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${req.files[i].filename}`);
                }
            )
        }

        user.avatar = imagesArr[0];
       
        await user.save();

        return res.status(200).json({
            _id: userId,
            avtar: imagesArr[0]
        })


    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

const removeImageFromCloudinary = async (req, res) => {
    const imgurl = req.query.img;
    const urlArr = imgurl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => { }
        );

        if (res) {
            response.status(200).send(res);
        }
    }
}

const updateUserdetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        error: true,
        success: false,
      });
    }

    const {
      name,
      email,
      mobile,
      password,
      avatar // Expect avatar as { url, publicId } or null or undefined
    } = req.body;

    const userExist = await UserModel.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        message: "The user cannot be updated!",
        error: true,
        success: false,
      });
    }

    let verifyCode = "";

    if (email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    // Handle avatar updates
    if (avatar) {
      // New avatar provided (object)
      if (
        userExist.avatar?.publicId &&
        avatar.publicId !== userExist.avatar.publicId
      ) {
        // Delete old avatar from Cloudinary
        await cloudinary.uploader.destroy(userExist.avatar.publicId);
      }
    } else if (avatar === null) {
      // User wants to remove avatar
      if (userExist.avatar?.publicId) {
        await cloudinary.uploader.destroy(userExist.avatar.publicId);
      }
    }

    // Build update object
    const updateData = {
      name,
      mobile,
      email,
      verify_email: email !== userExist.email ? false : true,
      password: hashPassword,
      otp: verifyCode !== "" ? verifyCode : null,
      otpExpires: verifyCode !== "" ? Date.now() + 600000 : null,
      avatar: avatar === undefined ? userExist.avatar : avatar, // only update if provided, else keep old
    };

    // Update user
    const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (email !== userExist.email) {
      await sendEmailFun({
        sendTo: email,
        subject: "Verify your email - VM App",
        text: "",
        html: verificationEmail(name, verifyCode),
      });
    }

    return res.json({
      message: "User updated successfully!",
      error: false,
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const forgetPasswordController = async (req, res) => {

    try {
        const { email } = req.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        else {
   
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;
            await user.save();


            const emailSent = await sendEmailFun(
                email,
                "Forget password OTP From VM App",
                "",
                verificationEmail(user.name, verifyCode)
            );

            return res.json({
                message: `Check Your Email`,
                error: false,
                success: true
            })

        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields: email and otp.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    const currentTime = Date.now();
    if (user.otpExpires < currentTime) {
      return res.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    // Clear OTP and expiry after verification
    user.otp = "";
    user.otpExpires = null;

    await user.save();

    // Generate JWT token for resetting password
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      message: "OTP Verified successfully",
      error: false,
      success: true,
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Auth middleware (req.user is set after verifying token)
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // <-- note: use .id as set by auth middleware

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect", success: false });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match", success: false });
    }

    // Optional: Add password strength validation here

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


const resetpassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    const email = req.user?.email; // from token via middleware
    if (!email) {
      return res.status(400).json({
        message: "Invalid user information from token",
        error: true,
        success: false,
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide newPassword and confirmPassword",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
      error: true,
    });
  }
};



const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return res.status(400).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return res.status(400).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id;
        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie("accessToken", newAccessToken, cookiesOption)

        return res.json({
            message: "New Access token generated",
            error: false,
            success: true,
            date: {
                accessToken: newAccessToken
            }
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const userDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "User ID missing",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    return res.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // exclude passwords if stored
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      error: false,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};


module.exports = {
    registerUserController,
    verifyEmailController,
    loginUserController,
    logoutController,
    userAvatarController,
    removeImageFromCloudinary,
    updateUserdetails,
    forgetPasswordController,
    verifyForgotPasswordOtp,
    updatePassword,
    resetpassword,
    refreshToken,
    userDetails,
    googleLoginController,
    getAllUsers,
    getUserByIdController,
};



// const UserModel = require("../model/VMUsermodel");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sendEmailFun = require("../config/sendEmail");
// const { verificationEmail } = require("../utils/verifyEmailTemplate");
// const generatedAccessToken = require("../utils/generatedAccessToken");
// const generatedRefreshToken = require("../utils/generatedRefreshToken");
// const generateReferralCode = require("../utils/generateReferralCode");
// const cloudinary = require('../config/cloudinaryConfig');
// const fs = require('fs');
// const { response } = require("express");
// const { verify } = require("crypto");
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// const googleLoginController = async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({ message: "Missing token", success: false });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     const { email_verified, email, name, picture } = payload;

//     if (!email_verified) {
//       return res.status(400).json({ message: "Email not verified", success: false });
//     }

//     let user = await UserModel.findOne({ email });

//     if (!user) {
//       user = new UserModel({
//         name,
//         email,
//         password: "", // because Google
//         verify_email: true,
//         avatar: picture,
//         status: "Active",
//         role: ["USER"],
//         referralCode: generateReferralCode(name),
//       });

//       await user.save();
//     } else {
//       if (user.status !== "Active") {
//         return res.status(403).json({
//           message: "Account disabled by admin",
//           success: false,
//         });
//       }
//     }

//     const accessToken = await generatedAccessToken(user._id);
//     const refreshToken = await generatedRefreshToken(user._id);

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       path: "/",
//       maxAge: 1000 * 60 * 10,
//     });

//     res.cookie("userRefreshToken", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       path: "/",
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });

//     return res.status(200).json({
//       message: "Google login/register successful",
//       success: true,
//       data: {
//         accessToken,
//         refreshToken,
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           avatar: user.avatar,
//            referralCode: user.referralCode,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Google Auth Error:", error.message || error);
//     return res.status(500).json({ message: "Server Error", error: true });
//   }
// };


// // const registerUserController = async (req, res) => {
// //   try {
// //     const { name, email, password, picture } = req.body;

// //     const isGoogleSignup = !password;

// //     if (!name || !email || (!password && !isGoogleSignup)) {
// //       return res.status(400).json({
// //         message: "Please provide name, email, and password",
// //         error: true,
// //         success: false,
// //       });
// //     }

// //     const existingUser = await UserModel.findOne({ email });

// //     // ✅ CASE 1: User already exists
// //     if (existingUser) {
// //       if (existingUser.verify_email) {
// //         return res.status(400).json({
// //           message: "User already registered and verified. Please login.",
// //           success: false,
// //           error: true,
// //         });
// //       } else {
// //         const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
// //         existingUser.otp = newOtp;
// //         existingUser.otpExpires = Date.now() + 600000;
// //         await existingUser.save();

// //         await sendEmailFun(
// //           email,
// //           "Resend: Verify Email From VM App",
// //           "",
// //           verificationEmail(existingUser.name || "User", newOtp)
// //         );

// //         return res.status(200).json({
// //           message: "Email already registered but not verified. OTP resent.",
// //           success: true,
// //           error: false,
// //         });
// //       }
// //     }

// //     // ✅ CASE 2: Create new user
// //     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

// //     const hashPassword = password
// //       ? await bcrypt.hash(password, await bcrypt.genSalt(10))
// //       : "";

// //     const newUser = new UserModel({
// //       name,
// //       email,
// //       password: hashPassword,
// //       otp: verifyCode,
// //       otpExpires: Date.now() + 600000,
// //       verify_email: isGoogleSignup ? true : false,
// //       avatar: {
// //         url: picture || "",
// //         publicId: null,
// //       },
// //       role: ["USER"],
// //       // referralCode: generateReferralCode(name || "USER")
// //     });

// //     await newUser.save();

// //     // 📧 REGULAR SIGNUP FLOW
// //     if (!isGoogleSignup) {
// //       const emailSent = await sendEmailFun(
// //         email,
// //         "Verify Email From VM App",
// //         "",
// //         verificationEmail(name, verifyCode)
// //       );

// //       if (!emailSent) {
// //         return res.status(500).json({
// //           message: "Failed to send verification email",
// //           error: true,
// //           success: false,
// //         });
// //       }

// //       const token = jwt.sign(
// //         { email: newUser.email, id: newUser._id },
// //         process.env.JWT_SECRET,
// //         { expiresIn: "1h" }
// //       );

// //       return res.status(201).json({
// //         message: "User registered successfully! Please verify your email.",
// //         error: false,
// //         success: true,
// //         token,
// //       });
// //     }

// //     // ✅ GOOGLE SIGNUP FLOW — generate tokens using utility functions
// //     const accessToken = await generatedAccessToken(newUser._id);
// //     const refreshToken = await generatedRefreshToken(newUser._id);

// //     newUser.access_token = accessToken;
// //     newUser.refresh_token = refreshToken;
// //     newUser.last_login_date = new Date();
// //     await newUser.save();

// //     return res.status(201).json({
// //       message: "Google signup successful",
// //       success: true,
// //       error: false,
// //       data: {
// //         accessToken,
// //         refreshToken,
// //         user: {
// //           _id: newUser._id,
// //           name: newUser.name,
// //           email: newUser.email,
// //           avatar: newUser.avatar.url,
// //            // referralCode: newUser.referralCode,
// //         },
// //       },
// //     });
// //   } catch (error) {
// //     console.error("❌ Registration Error:", error);
// //     return res.status(500).json({
// //       message: error.message || "Server error",
// //       error: true,
// //       success: false,
// //     });
// //   }
// // };

// const registerUserController = async (req, res) => {
//   try {
//     const { name, email, password, picture, referralCode: refCode } = req.body;

//     const isGoogleSignup = !password;

//     if (!name || !email || (!password && !isGoogleSignup)) {
//       return res.status(400).json({
//         message: "Please provide name, email, and password",
//         success: false,
//         error: true,
//       });
//     }

//     const existingUser = await UserModel.findOne({ email });

//     // CASE 1: User exists
//     if (existingUser) {
//       if (existingUser.verify_email) {
//         return res.status(400).json({
//           message: "User already registered and verified. Please login.",
//           success: false,
//           error: true,
//         });
//       } else {
//         const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//         existingUser.otp = newOtp;
//         existingUser.otpExpires = Date.now() + 600000;
//         await existingUser.save();

//         await sendEmailFun(
//           email,
//           "Resend: Verify Email From VM App",
//           "",
//           verificationEmail(existingUser.name || "User", newOtp)
//         );

//         return res.status(200).json({
//           message: "Email already registered but not verified. OTP resent.",
//           success: true,
//           error: false,
//         });
//       }
//     }

//     // CASE 2: Create new user
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const hashPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt(10)) : "";

//     const newUser = new UserModel({
//       name,
//       email,
//       password: hashPassword,
//       otp: verifyCode,
//       otpExpires: Date.now() + 600000,
//       verify_email: isGoogleSignup ? true : false,
//       avatar: { url: picture || "", publicId: null },
//       role: ["USER"],
//       referralCode: generateReferralCode(name),
//       referredBy: refCode || null,
//     });

//     await newUser.save();

//     if (!isGoogleSignup) {
//       const emailSent = await sendEmailFun(
//         email,
//         "Verify Email From VM App",
//         "",
//         verificationEmail(name, verifyCode)
//       );

//       if (!emailSent) {
//         return res.status(500).json({
//           message: "Failed to send verification email",
//           error: true,
//           success: false,
//         });
//       }

//       const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//       return res.status(201).json({
//         message: "User registered successfully! Please verify your email.",
//         error: false,
//         success: true,
//         token,
//       });
//     }

//     // Google signup flow
//     const accessToken = await generatedAccessToken(newUser._id);
//     const refreshToken = await generatedRefreshToken(newUser._id);

//     newUser.access_token = accessToken;
//     newUser.refresh_token = refreshToken;
//     newUser.last_login_date = new Date();
//     await newUser.save();

//     return res.status(201).json({
//       message: "Google signup successful",
//       success: true,
//       error: false,
//       data: {
//         accessToken,
//         refreshToken,
//         user: {
//           _id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//           avatar: newUser.avatar.url,
//           referralCode: newUser.referralCode,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     return res.status(500).json({
//       message: error.message || "Server error",
//       error: true,
//       success: false,
//     });
//   }
// };


// const verifyEmailController = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const user = await UserModel.findOne({ email })
//         if (!user) {
//             return res.status(400).json({ error: true, success: false, message: "user not found" });
//         }

//         const isOtpValid = user.otp === otp;
//         const isNotExpired = user.otpExpires > Date.now();

//         if (isOtpValid && isNotExpired) {
//             user.verify_email = true;
//             user.otp = null;
//             user.otpExpires = null;
//             await user.save()
//             return res.status(200).json({ success: true, error: false, massage: "Email verified successfully" })
//         }
//         else if (!isOtpValid) {
//             return res.status(400).json({ success: false, error: true, massage: "Invalid OTP" })
//         }
//         else {
//             return res.status(400).json({ success: false, error: true, massage: "OTP expired" })
//         }
//     }
//     catch (error) {
//         return res.status(500).json({
//             message: error.message || "Internal Server Error",
//             error: true,
//             success: false,
//         });
//     }
// }

// const loginUserController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "User not registered",
//         error: true,
//         success: false,
//       });
//     }

//     if (user.status !== "Active") {
//       return res.status(400).json({
//         message: "Contact Admin for account status",
//         error: true,
//         success: false,
//       });
//     }

//     if (!user.verify_email) {
//       return res.status(400).json({
//         message: "Your Email is not verified yet. Please verify your email first",
//         error: true,
//         success: false,
//       });
//     }
//     // 👇 ADD THIS AFTER USER IS FOUND
// if (!user.referralCode) {
//   user.referralCode = generateReferralCode(user.name);
//   await user.save();
// }


//     const checkPassword = await bcrypt.compare(password, user.password);
//     if (!checkPassword) {
//       return res.status(400).json({
//         message: "Invalid password",
//         error: true,
//         success: false,
//       });
//     }

//     const accessToken = await generatedAccessToken(user._id);
//     const refreshToken = await generatedRefreshToken(user._id);

//     await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });

//     const cookieOptions = {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       path: "/",
//       maxAge: 1000 * 60 * 10, // 15 minutes for accessToken
//     };

//     res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 10 });
//     res.cookie("userRefreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

//     return res.json({
//       message: "Login successful",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// };

// const logoutController = async (req, res) => {
//   try {
//     const userId = req.user?.id; // ✅ Correct way to access user ID

//     const cookiesOption = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//     };

//     // Clear cookies
//     res.clearCookie("accessToken", cookiesOption);
//     res.clearCookie("userRefreshToken", cookiesOption);

//     // Optional: Clear refresh token in DB
//     if (userId) {
//       await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });
//     }

//     return res.json({
//       message: "Logout successfully",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// };

// var imagesArr = []
// const userAvatarController = async (req, res) => {
//     try {
//         imagesArr = [];

//         const userId = req.userId;
//         const image = req.files;
       

//         const user = await UserModel.findOne({ _id: userId });

//         const imgurl = user.avatar;
//         const urlArr = imgurl.split("/");
//         const avatar_image = urlArr[urlArr.length - 1];
//         const imageName = avatar_image.split(".")[0];

//         if (imageName) {
//             const res = await cloudinary.uploader.destroy(
//                 imageName,
//                 (error, result) => { }
//             );

//         }


//         if (!user) {
//             return res.status(500).json({
//                 message: "User not found",
//                 error: true,
//                 success: false
//             })
//         }

//         const options = {
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false,

//         };
//         for (let i = 0; i < image?.length; i++) {

//             const img = await cloudinary.uploader.upload(
//                 image[i].path,
//                 options,
//                 function (error, result) {
//                     imagesArr.push(result.secure_url);
//                     fs.unlinkSync(`uploads/${req.files[i].filename}`);
//                 }
//             )
//         }

//         user.avatar = imagesArr[0];
       
//         await user.save();

//         return res.status(200).json({
//             _id: userId,
//             avtar: imagesArr[0]
//         })


//     }
//     catch (error) {
//         return res.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })

//     }
// }

// const removeImageFromCloudinary = async (req, res) => {
//     const imgurl = req.query.img;
//     const urlArr = imgurl.split("/");
//     const image = urlArr[urlArr.length - 1];
//     const imageName = image.split(".")[0];

//     if (imageName) {
//         const res = await cloudinary.uploader.destroy(
//             imageName,
//             (error, result) => { }
//         );

//         if (res) {
//             response.status(200).send(res);
//         }
//     }
// }

// const updateUserdetails = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({
//         message: "Unauthorized: User ID missing",
//         error: true,
//         success: false,
//       });
//     }

//     const {
//       name,
//       email,
//       mobile,
//       password,
//       avatar // Expect avatar as { url, publicId } or null or undefined
//     } = req.body;

//     const userExist = await UserModel.findById(userId);
//     if (!userExist) {
//       return res.status(400).json({
//         message: "The user cannot be updated!",
//         error: true,
//         success: false,
//       });
//     }

//     let verifyCode = "";

//     if (email !== userExist.email) {
//       verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     }

//     let hashPassword = "";

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       hashPassword = await bcrypt.hash(password, salt);
//     } else {
//       hashPassword = userExist.password;
//     }

//     // Handle avatar updates
//     if (avatar) {
//       // New avatar provided (object)
//       if (
//         userExist.avatar?.publicId &&
//         avatar.publicId !== userExist.avatar.publicId
//       ) {
//         // Delete old avatar from Cloudinary
//         await cloudinary.uploader.destroy(userExist.avatar.publicId);
//       }
//     } else if (avatar === null) {
//       // User wants to remove avatar
//       if (userExist.avatar?.publicId) {
//         await cloudinary.uploader.destroy(userExist.avatar.publicId);
//       }
//     }

//     // Build update object
//     const updateData = {
//       name,
//       mobile,
//       email,
//       verify_email: email !== userExist.email ? false : true,
//       password: hashPassword,
//       otp: verifyCode !== "" ? verifyCode : null,
//       otpExpires: verifyCode !== "" ? Date.now() + 600000 : null,
//       avatar: avatar === undefined ? userExist.avatar : avatar, // only update if provided, else keep old
//     };

//     // Update user
//     const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
//       new: true,
//     });

//     if (email !== userExist.email) {
//       await sendEmailFun({
//         sendTo: email,
//         subject: "Verify your email - VM App",
//         text: "",
//         html: verificationEmail(name, verifyCode),
//       });
//     }

//     return res.json({
//       message: "User updated successfully!",
//       error: false,
//       success: true,
//       user: updateUser,
//     });
//   } catch (error) {
//     console.error("Update user error:", error);
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// const forgetPasswordController = async (req, res) => {

//     try {
//         const { email } = req.body

//         const user = await UserModel.findOne({ email })

//         if (!user) {
//             return res.status(400).json({
//                 message: "Email not available",
//                 error: true,
//                 success: false
//             })
//         }
//         else {
   
//             let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//             user.otp = verifyCode;
//             user.otpExpires = Date.now() + 600000;
//             await user.save();


//             const emailSent = await sendEmailFun(
//                 email,
//                 "Forget password OTP From VM App",
//                 "",
//                 verificationEmail(user.name, verifyCode)
//             );

//             return res.json({
//                 message: `Check Your Email`,
//                 error: false,
//                 success: true
//             })

//         }
//     }
//     catch (error) {
//         return res.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }

// const verifyForgotPasswordOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         message: "Provide required fields: email and otp.",
//         error: true,
//         success: false,
//       });
//     }

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "Email not available",
//         error: true,
//         success: false,
//       });
//     }

//     if (otp !== user.otp) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//         error: true,
//         success: false,
//       });
//     }

//     const currentTime = Date.now();
//     if (user.otpExpires < currentTime) {
//       return res.status(400).json({
//         message: "OTP is expired",
//         error: true,
//         success: false,
//       });
//     }

//     // Clear OTP and expiry after verification
//     user.otp = "";
//     user.otpExpires = null;

//     await user.save();

//     // Generate JWT token for resetting password
//     const resetToken = jwt.sign(
//       { email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     return res.status(200).json({
//       message: "OTP Verified successfully",
//       error: false,
//       success: true,
//       resetToken,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// // Auth middleware (req.user is set after verifying token)
// const updatePassword = async (req, res) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;
//   const userId = req.user.id; // <-- note: use .id as set by auth middleware

//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found", success: false });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password is incorrect", success: false });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match", success: false });
//     }

//     // Optional: Add password strength validation here

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     user.password = hashedPassword;
//     await user.save();

//     res.json({ message: "Password updated successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };


// const resetpassword = async (req, res) => {
//   try {
//     const { newPassword, confirmPassword } = req.body;

//     const email = req.user?.email; // from token via middleware
//     if (!email) {
//       return res.status(400).json({
//         message: "Invalid user information from token",
//         error: true,
//         success: false,
//       });
//     }

//     if (!newPassword || !confirmPassword) {
//       return res.status(400).json({
//         message: "Please provide newPassword and confirmPassword",
//         error: true,
//         success: false,
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         message: "Passwords do not match",
//         error: true,
//         success: false,
//       });
//     }

//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         error: true,
//         success: false,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).json({
//       message: "Password reset successfully",
//       success: true,
//       error: false,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: err.message,
//       success: false,
//       error: true,
//     });
//   }
// };



// const refreshToken = async (req, res) => {
//     try {
//         const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

//         if (!refreshToken) {
//             return res.status(400).json({
//                 message: "Invalid token",
//                 error: true,
//                 success: false
//             })
//         }

//         const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

//         if (!verifyToken) {
//             return res.status(400).json({
//                 message: "token is expired",
//                 error: true,
//                 success: false
//             })
//         }

//         const userId = verifyToken?._id;
//         const newAccessToken = await generatedAccessToken(userId)

//         const cookiesOption = {
//             httpOnly: true,
//             secure: true,
//             sameSite: "None"
//         }

//         response.cookie("accessToken", newAccessToken, cookiesOption)

//         return res.json({
//             message: "New Access token generated",
//             error: false,
//             success: true,
//             date: {
//                 accessToken: newAccessToken
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }

// const userDetails = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({
//         message: "User ID missing",
//         error: true,
//         success: false,
//       });
//     }

//     const user = await UserModel.findById(userId);
//     return res.json({
//       message: "user details",
//       data: user,
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };


// const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find().select('-password'); // exclude passwords if stored
//     res.status(200).json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getUserByIdController = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     if (!userId) {
//       return res.status(400).json({
//         message: "User ID is required",
//         error: true,
//         success: false,
//       });
//     }

//     const user = await UserModel.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         error: true,
//         success: false,
//       });
//     }

//     return res.status(200).json({
//       message: "User found",
//       success: true,
//       error: false,
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// };


// module.exports = {
//     registerUserController,
//     verifyEmailController,
//     loginUserController,
//     logoutController,
//     userAvatarController,
//     removeImageFromCloudinary,
//     updateUserdetails,
//     forgetPasswordController,
//     verifyForgotPasswordOtp,
//     updatePassword,
//     resetpassword,
//     refreshToken,
//     userDetails,
//     googleLoginController,
//     getAllUsers,
//     getUserByIdController,
// };



















