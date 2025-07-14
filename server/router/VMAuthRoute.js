const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")
const { refreshTokenController,meController } = require("../controller/auth.Controller");

router.post("/refresh-token", refreshTokenController);
router.get("/me", auth, meController);

module.exports = router;
