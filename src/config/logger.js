// src/config/logger.js
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

// Tạo stream để ghi log ra file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../../logs/access.log"),
  { flags: "a" }
);

// Log ra console & file
const logger = morgan("combined", { stream: accessLogStream });

module.exports = logger;
 