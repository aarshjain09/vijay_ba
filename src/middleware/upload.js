const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: "products",

      // ✅ Force valid image format
      format: file.mimetype === "image/png"
        ? "png"
        : file.mimetype === "image/jpeg"
        ? "jpg"
        : "jpg",

      // ✅ Stable public ID
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")}`,

      resource_type: "image",
      access_mode: "public"
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
