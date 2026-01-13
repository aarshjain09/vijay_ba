const mongoose = require("mongoose"); // 👈 THIS WAS MISSING

const userSchema = new mongoose.Schema(
  {
    shopName: String,
    ownerName: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    address: String,
    role: {
      type: String,
      enum: ["admin", "shopkeeper"],
      default: "shopkeeper",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
