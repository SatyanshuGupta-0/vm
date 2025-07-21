
 
// authorizeRoles.js
const jwt = require("jsonwebtoken");
const Admin = require("../model/VMAdmin.model");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      if (!allowedRoles.includes(admin.role)) {
        return res.status(403).json({ message: `Access denied for role: ${admin.role}` });
      }

      req.admin = admin;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authorizeRoles;
