const multer = require("multer");
const createCloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = createCloudinaryStorage({
  // multer-storage-cloudinary@2 expects cloudinary.v2
  cloudinary: { v2: cloudinary },
  params: {
    folder: "dipak_portfolio/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
