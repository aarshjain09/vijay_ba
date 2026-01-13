const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const upload = require("./middleware/upload");

console.log("🔥 APP ENTRY FILE LOADED");

const app = express();

/* ================================
   🔥 MIDDLEWARE ORDER (CRITICAL)
================================ */

// 1️⃣ CORS
app.use(cors());

// 2️⃣ 🔥 MULTER FIRST (multipart stream)
app.use(upload.any());

// 3️⃣ JSON parser AFTER multer
app.use(express.json());

// 4️⃣ DB
connectDB();

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("B2B E-commerce API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

module.exports = app;
