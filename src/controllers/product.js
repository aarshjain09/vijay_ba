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
      company, // ✅ NEW
      pricePerPiece,
      actualPricePerPiece,
      piecesPerBox,
      stockBoxes = 0,
      stockPieces = 0
    } = req.body;

    // Required fields
    if (!name || !company || !pricePerPiece || !piecesPerBox) {
      return res.status(400).json({
        message:
          "Name, company, pricePerPiece and piecesPerBox are required"
      });
    }

    // Product image (Cloudinary)
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
      company, // ✅ SAVE COMPANY ID
      pricePerPiece: price,
      actualPrice: actualPricePerPiece,
      piecesPerBox: pieces,
      boxPrice: price * pieces,
      stockBoxes: normalized.stockBoxes,
      stockPieces: normalized.stockPieces,

      // Cloudinary URL
      image: imageFile.path,
      isActive: true
    });

    await product.save();

    // populate company for immediate frontend use
    await product.populate("company", "name image");

    res.status(201).json(product);
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

    if (req.body.company !== undefined) {
      product.company = req.body.company; // ✅ ALLOW COMPANY CHANGE
    }

    product.boxPrice =
      product.pricePerPiece * product.piecesPerBox;

    await product.save();
    await product.populate("company", "name image");

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
    await product.populate("company", "name image");

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
    const products = await Product.find({ isActive: true })
      .populate("company", "name image");

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};
exports.getProductsByCompany = async (req, res) => {
  try {
    console.log("🔎 companyId param:", req.params.companyId);

    const products = await Product.find({
      company: req.params.companyId,
      isActive: true
    });
    res.json(products);
  } catch (err) {
    console.error("❌ error:", err);
    res.status(500).json({ message: err.message });
  }
};


