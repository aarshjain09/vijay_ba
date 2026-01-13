const Product = require("../models/product");

/* ================================
   HELPER: NORMALIZE STOCK
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
================================ */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      pricePerPiece,
      piecesPerBox,
      stockBoxes = 0,
      stockPieces = 0
    } = req.body;

    // Required fields
    if (!name || !pricePerPiece || !piecesPerBox) {
      return res.status(400).json({
        message: "Name, pricePerPiece and piecesPerBox are required"
      });
    }

    // ✅ CORRECT: read from req.files
    const imageFile = req.files?.find(
      f => f.fieldname === "image"
    );

    if (!imageFile) {
      return res.status(400).json({
        message: "Product image is required"
      });
    }

    const price = Number(pricePerPiece);
    const pieces = Number(piecesPerBox);

    if (isNaN(price) || isNaN(pieces)) {
      return res.status(400).json({
        message: "Invalid numeric values"
      });
    }

    const normalized = normalizeStock(
      Number(stockBoxes),
      Number(stockPieces),
      pieces
    );

    const product = new Product({
      name,
      pricePerPiece: price,
      piecesPerBox: pieces,
      boxPrice: price * pieces,
      stockBoxes: normalized.stockBoxes,
      stockPieces: normalized.stockPieces,

      // ✅ USE imageFile.path
      image: imageFile.path,
      isActive: true
    });

    await product.save();
    res.status(201).json(product)
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({
      message: "Failed to create product"
    });
  }
};

/* ================================
   UPDATE PRODUCT
================================ */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (req.body.pricePerPiece !== undefined) {
      const price = Number(req.body.pricePerPiece);
      if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid price" });
      }
      product.pricePerPiece = price;
    }

    if (req.body.piecesPerBox !== undefined) {
      const pieces = Number(req.body.piecesPerBox);
      if (isNaN(pieces)) {
        return res.status(400).json({
          message: "Invalid piecesPerBox"
        });
      }
      product.piecesPerBox = pieces;
    }

    product.boxPrice =
      product.pricePerPiece * product.piecesPerBox;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({
      message: "Failed to update product"
    });
  }
};

/* ================================
   ADD STOCK
================================ */
exports.addStock = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Add stock error:", err);
    res.status(500).json({
      message: "Failed to add stock"
    });
  }
};

/* ================================
   GET PRODUCTS
================================ */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};
