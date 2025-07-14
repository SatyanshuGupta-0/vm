const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Extract access token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    // If no token, deny access
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        error: true,
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    // Handle expired access token
    if (error.name === "TokenExpiredError") {
      res.clearCookie("accessToken");

      return res.status(401).json({
        message: "Token expired", // IMPORTANT: must match what frontend checks
        error: true,
        success: false,
      });
    }

    // Handle invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    // Catch-all
    return res.status(500).json({
      message: "Authentication failed",
      error: true,
      success: false,
    });
  }
};

module.exports = auth;
