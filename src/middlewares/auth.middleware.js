// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header Authorization: "Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token, vui lòng đăng nhập." });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
      }

      // Gắn user vào request để controller dùng
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(500).json({ message: "Lỗi xác thực" });
  }
};

module.exports = authMiddleware;
