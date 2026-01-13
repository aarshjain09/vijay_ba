const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  pricePerPiece: Number,
  piecesPerBox: Number,
  boxPrice: Number,
  stockBoxes: Number,
  stockPieces: Number,
  image: String,
  isActive: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model("Product", productSchema);
