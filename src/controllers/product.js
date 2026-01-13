const Product = require("../models/product");

/* ================================
   HELPER: NORMALIZE STOCK
   Converts extra pieces → boxes
================================ */
const normalizeStock = (boxes, pieces, piecesPerBox) => {
  const extraBoxes = Math.floor(pieces / piecesPerBox);
  return {
    stockBoxes: boxes + extraBoxes,
    stockPieces: pieces % piecesPerBox
  };
};

/* ================================
   CREATE PRODUCT (ADMIN)
   Initial stock allowed
================================ */
exports.createProduct = async (req, res) => {
  const {
    name,
    pricePerPiece,
    piecesPerBox,
    stockBoxes = 0,
    stockPieces = 0
  } = req.body;

  if (!name || !pricePerPiece || !piecesPerBox) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  const normalized = normalizeStock(
    Number(stockBoxes),
    Number(stockPieces),
    Number(piecesPerBox)
  );

  const product = new Product({
    name,
    pricePerPiece: Number(pricePerPiece),
    piecesPerBox: Number(piecesPerBox),
    boxPrice: Number(pricePerPiece) * Number(piecesPerBox),
    stockBoxes: normalized.stockBoxes,
    stockPieces: normalized.stockPieces,
    image: req.file ? `/uploads/products/${req.file.filename}` : null,
    isActive: true
  });

  await product.save();
  res.json(product);
};

/* ================================
   UPDATE PRODUCT
   ❌ NO STOCK CHANGES HERE
================================ */
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  if (req.body.pricePerPiece !== undefined) {
    product.pricePerPiece = Number(req.body.pricePerPiece);
  }

  if (req.body.piecesPerBox !== undefined) {
    product.piecesPerBox = Number(req.body.piecesPerBox);
  }

  product.boxPrice =
    product.pricePerPiece * product.piecesPerBox;

  await product.save();
  res.json(product);
};

/* ================================
   ADD STOCK (ADMIN ONLY)
   Safe incremental update
================================ */
exports.addStock = async (req, res) => {
  const { stockBoxes = 0, stockPieces = 0 } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const totalPieces =
    product.stockBoxes * product.piecesPerBox +
    product.stockPieces +
    Number(stockBoxes) * product.piecesPerBox +
    Number(stockPieces);

  product.stockBoxes = Math.floor(
    totalPieces / product.piecesPerBox
  );
  product.stockPieces =
    totalPieces % product.piecesPerBox;

  await product.save();
  res.json(product);
};

/* ================================
   GET PRODUCTS
================================ */
exports.getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
};
