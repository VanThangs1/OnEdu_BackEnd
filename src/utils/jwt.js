// utils/jwt.js
const jwt = require("jsonwebtoken");

const ACCESS_KEY = process.env.ACCESS_KEY || "access-secret";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh-secret";

// Thời gian sống
const ACCESS_EXPIRES = "15m";   // Access token sống 15 phút
const REFRESH_EXPIRES = "7d";   // Refresh token sống 7 ngày

// Tạo Access Token
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_KEY, { expiresIn: ACCESS_EXPIRES });
}

// Tạo Refresh Token
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_EXPIRES });
}

// Verify Access Token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_KEY);
  } catch (err) {
    return null;
  }
}

// Verify Refresh Token
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
