const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getAdminProfile
} = require("../controller/Admin.Controller");
const protectAdmin = require("../middlewares/isAdmin");
const authorizeRoles = require("../middlewares/roleAuth");

router.post("/registers",authorizeRoles("superadmin"), registerAdmin);
router.post("/login", loginAdmin);
router.get("/refresh-token", refreshToken);
router.get("/logout", logoutAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

module.exports = router;
