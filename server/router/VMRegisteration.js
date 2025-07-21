const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/User.controller");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const verifyReset = require("../middlewares/verifyReset");
const upload = require("../middlewares/multer");

// Public routes
router.post("/register", registerUserController);
router.post("/verifyEmail", verifyEmailController);
router.post("/login", loginUserController);
router.post("/google-auth", googleLoginController);
router.post("/forgot-password", forgetPasswordController);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
router.post("/update-password", auth, updatePassword);
router.post("/reset-password",verifyReset , resetpassword);
router.post("/refresh-token", refreshToken);

// Authenticated user routes
router.get("/logout", auth, logoutController);
router.post("/user-avatar", auth, upload.array("avatar"), userAvatarController);
router.delete("/deleteImage", auth, removeImageFromCloudinary);
router.put("/:id", auth, updateUserdetails);
router.get("/user-details", auth, userDetails);

// Admin routes
router.get("/getuser",  isAdmin("superadmin"), getAllUsers);
router.get("/:id",  isAdmin, getUserByIdController);

module.exports = router;
