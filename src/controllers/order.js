const Order = require("../models/order");
const Product = require("../models/product");

// ================================
// CREATE ORDER
// ================================
exports.createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Order must have at least one item"
    });
  }

  // 1️⃣ CHECK STOCK
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const availablePieces =
      product.stockBoxes * product.piecesPerBox +
      product.stockPieces;

    const requiredPieces =
      Number(item.boxes || 0) * product.piecesPerBox +
      Number(item.pieces || 0);

    if (requiredPieces <= 0) {
      return res.status(400).json({
        message: "Quantity cannot be zero"
      });
    }

    if (requiredPieces > availablePieces) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}`
      });
    }
  }

  // 2️⃣ DEDUCT STOCK
  for (const item of items) {
    const product = await Product.findById(item.product);

    let remainingPieces =
      product.stockBoxes * product.piecesPerBox +
      product.stockPieces -
      (Number(item.boxes || 0) * product.piecesPerBox +
        Number(item.pieces || 0));

    product.stockBoxes = Math.floor(
      remainingPieces / product.piecesPerBox
    );
    product.stockPieces =
      remainingPieces % product.piecesPerBox;

    await product.save();
  }

  // 3️⃣ SAVE ORDER
  const order = new Order({
    user: req.user._id,
    items: items.map(i => ({
      product: i.product,
      boxes: Number(i.boxes || 0),
      pieces: Number(i.pieces || 0)
    })),
    totalAmount,
    status: "pending"
  });

  await order.save();
  res.json(order);
};

// ================================
// USER ORDER HISTORY
// ================================
exports.getOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id
  }).populate("items.product");

  res.json(orders);
};

// ================================
// ADMIN – ALL ORDERS
// ================================
exports.getAdminOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product");

  res.json(orders);
};

// ================================
// ADMIN – UPDATE STATUS
// ================================
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = req.body.status;
  await order.save();
  res.json(order);
};
