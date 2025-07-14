const jwt = require("jsonwebtoken");
const User = require("../model/User.model"); // Shared User model

const roleAuth = (...allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      const hasRole = user.role.some(role => allowedRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ success: false, message: "Access denied: insufficient permissions" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Auth Error:", err);
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }
  };
};

module.exports = roleAuth;
