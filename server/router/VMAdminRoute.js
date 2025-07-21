const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getAdminProfile,
  getAllAdmins
} = require("../controller/Admin.Controller");
const isAdmin = require("../middlewares/isAdmin");

router.post("/registers", isAdmin("superadmin") , registerAdmin);
router.post("/login", loginAdmin);
router.get("/refresh-token", refreshToken);
router.get("/logout", logoutAdmin);
router.get("/profile", isAdmin("superadmin"), getAdminProfile);
router.get("/all-admins", isAdmin("superadmin"), getAllAdmins);

module.exports = router;
