const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ DB connection (see FIX 2 below)
connectDB();

// Static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("B2B E-commerce API running");
});

// ✅ REQUIRED for Vercel
module.exports = app;
