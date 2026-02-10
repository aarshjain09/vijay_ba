const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Company = require("../models/company");

// CREATE COMPANY (ADMIN)
// image = Cloudinary URL
router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "Company name and image are required"
      });
    }

    const company = await Company.create({
      name,
      image
    });

    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL COMPANIES (HOME PAGE)
router.get("/", auth, async (req, res) => {
  const companies = await Company.find({ isActive: true })
    .sort({ name: 1 });

  res.json(companies);
});

module.exports = router;
