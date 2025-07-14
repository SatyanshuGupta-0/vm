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

router.post("/registers", registerAdmin);
router.post("/login", loginAdmin);
router.get("/refresh-token", refreshToken);
router.get("/logout", logoutAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

module.exports = router;
