const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// 🚫 DO NOT listen on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
}

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", require("./routes/user"));
app.use("/api/companies", require("./routes/company"));

app.get("/", (req, res) => {
  res.send("B2B E-commerce API running");
});

module.exports = app;
