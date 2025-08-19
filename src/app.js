// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Import routes
// const authRoutes = require("./routes/auth.routes");
// const userRoutes = require("./routes/user.routes");

// Import middleware
// const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// ===== Middleware cơ bản =====
app.use(express.json());                // Đọc JSON body
app.use(express.urlencoded({ extended: true })); // Đọc form data
app.use(cors());                        // Cho phép CORS
app.use(helmet());                      // Bảo mật headers
app.use(morgan("dev"));                 // Log request

// ===== Public folder =====
// Ví dụ: public/logo.png -> http://localhost:3000/logo.png
app.use(express.static(path.join(__dirname, "../public")));

// ===== Routes =====
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World")
})

// ===== Error handler =====
// app.use(errorMiddleware);

module.exports = app;
