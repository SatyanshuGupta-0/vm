const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getAdminProfile,
  getAllAdmins,
  forgotPassword,
  resetPassword,
} = require("../controller/Admin.Controller");
const isAdmin = require("../middlewares/isAdmin");

router.post("/registers", isAdmin("superadmin") , registerAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshToken);
router.get("/logout", logoutAdmin);
router.get("/profile", isAdmin("superadmin"), getAdminProfile);
router.get("/all-admins", isAdmin("superadmin"), getAllAdmins);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
