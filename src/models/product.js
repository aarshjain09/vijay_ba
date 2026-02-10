const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  // ✅ CORRECT COMPANY REFERENCE
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  // 🔹 Prices
  actualPrice: {
    type: Number,
    default: 0,
  },

  sellingPrice: {
    type: Number,
    default: 0,
  },

  // 🔹 Stock & pricing
  pricePerPiece: Number,
  piecesPerBox: Number,
  boxPrice: Number,

  stockBoxes: {
    type: Number,
    default: 0,
  },

  stockPieces: {
    type: Number,
    default: 0,
  },

  image: String,

  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Product", productSchema);
