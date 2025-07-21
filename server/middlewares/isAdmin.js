const jwt = require("jsonwebtoken");
const Admin = require("../model/VMAdmin.model");

// Middleware factory: Pass allowed roles like isAdmin("superadmin", "manager")
const isAdmin = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // ✅ Check if token exists and is a Bearer token
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // ✅ Decode JWT
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      if (!decoded?.id) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // ✅ Fetch admin from DB
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      // ✅ Role-based access check (case-insensitive)
      const adminRole = admin.role?.toLowerCase().trim();
      const allowed = allowedRoles.map((r) => r.toLowerCase());

      if (!allowed.includes(adminRole)) {
        return res.status(403).json({ message: "Access denied for your role" });
      }

      // ✅ Attach admin to request
      req.admin = admin;
      next();
    } catch (err) {
      console.error("❌ isAdmin Middleware Error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = isAdmin;
