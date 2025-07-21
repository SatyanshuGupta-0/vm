const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getAdminProfile
} = require("../controller/Admin.Controller");
const isAdmin = require("../middlewares/isAdmin");

router.post("/registers",isAdmin("superadmin"), registerAdmin);
router.post("/login", loginAdmin);
router.get("/refresh-token", refreshToken);
router.get("/logout", logoutAdmin);
router.get("/profile", isAdmin, getAdminProfile);

module.exports = router;
