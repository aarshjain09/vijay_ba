const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload"); // ✅ REQUIRED

const productController = require("../controllers/product");

// Get all products
router.get("/", auth, productController.getProducts);

// Get products by company
router.get(
  "/company/:companyId",
  auth,
  productController.getProductsByCompany
);

// Create product (WITH IMAGE UPLOAD)
router.post(
  "/",
  auth,
  admin,
  upload.any(), // ✅ THIS WAS MISSING
  productController.createProduct
);

// Update product
router.put(
  "/:id",
  auth,
  admin,
  productController.updateProduct
);

// Add stock
router.put(
  "/:id/add-stock",
  auth,
  admin,
  productController.addStock
);

module.exports = router;
