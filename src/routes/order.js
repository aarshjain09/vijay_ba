const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const orderController = require("../controllers/order");

console.log("orderController:", orderController);

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getOrders);
router.get("/admin", auth, admin, orderController.getAdminOrders);
router.put("/:id/status", auth, admin, orderController.updateOrderStatus);

module.exports = router;
