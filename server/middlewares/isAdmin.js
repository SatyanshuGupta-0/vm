// middleware/isAdmin.js
const jwt = require("jsonwebtoken");
const Admin = require("../model/VMAdmin.model");

const isAdmin = (...allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      console.log("Admin role:", admin.role); // ✅ Debug
      console.log("Allowed roles:", allowedRoles); // ✅ Debug

      if (!allowedRoles.includes(admin.role)) {
        return res.status(403).json({ message: `Access denied for role: ${admin.role}` });
      }

      req.user = admin; // ✅ Fix: attach as req.user
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = isAdmin;
