const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

const productController = require("../controllers/product");

// SAFETY CHECK (TEMPORARY – REMOVE LATER)
console.log("productController:", productController);

// Get products
router.get("/", auth, productController.getProducts);

// Create product
router.post(
  "/",
  auth,
  admin,
  productController.createProduct
);



// Update price / pcs-per-box
router.put(
  "/:id",
  auth,
  admin,
  productController.updateProduct
);

// ADD STOCK (THIS WAS FAILING)
router.put(
  "/:id/add-stock",
  auth,
  admin,
  productController.addStock
);

module.exports = router;
