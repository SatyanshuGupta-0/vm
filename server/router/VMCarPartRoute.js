const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const saveChangeController = require("../controller/CarPart.Controller");

// 🔒 Authenticated User Routes
router.post("/save", auth, saveChangeController.addChange);                      // Save a new change
router.get("/user/:userId", auth, saveChangeController.getUserChanges);         // Get changes by user
router.put("/update/:id", auth, saveChangeController.updateChange);             // Update a change
router.delete("/delete/:id", auth, saveChangeController.deleteChange);          // Delete a change

// 🛠️ Optional: Admin route to get all user changes
// router.get("/admin/all", auth, isAdmin, saveChangeController.getAllChanges);

module.exports = router;
