const jwt = require("jsonwebtoken");
const Admin = require("../model/VMAdmin.model");

const isAdmin = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      const adminRole = admin.role?.toLowerCase().trim(); // ✅ Cleaned
      console.log("🎯 Admin role:", adminRole);
      console.log("✅ Allowed Roles:", allowedRoles);

      const allowed = allowedRoles.map(r => r.toLowerCase());
      if (!allowed.includes(adminRole)) {
        return res.status(403).json({ message: `Access denied for role: ${adminRole}` });
      }

      req.admin = admin;
      next();
    } catch (err) {
      console.error("❌ isAdmin Middleware Error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = isAdmin;
