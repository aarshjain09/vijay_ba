const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      boxes: Number,
      pieces: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "pending"
  }
});


module.exports = mongoose.model("Order", orderSchema);
