const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  pricePerPiece: Number,
  piecesPerBox: Number,
  boxPrice: Number,
  stockBoxes: {
    type: Number,
    default: 0
  },
  stockPieces: {
    type: Number,
    default: 0
  },
  image: String
});

module.exports = mongoose.model("Product", productSchema);
