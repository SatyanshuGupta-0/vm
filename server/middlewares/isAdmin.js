const jwt = require("jsonwebtoken");
const Admin = require("../model/VMAdmin.model");

const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
  const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
  console.log("Decoded Token:", decoded);

  const admin = await Admin.findById(decoded.id).select("-password");
  if (!admin) {
    console.warn("Admin not found for ID:", decoded.id);
    return res.status(401).json({ message: "Admin not found" });
  }

  req.admin = admin;
  next();
} catch (err) {
  console.error("JWT Error:", err.name, err.message);
  res.status(401).json({ message: "Invalid or expired token" });
}
 
};

module.exports = protectAdmin;
 
