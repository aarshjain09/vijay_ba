const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getUsers } = require("../controllers/user");

router.get("/", auth, admin, getUsers);

module.exports = router;
