const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    album: { type: String, default: "Featured Projects" },
    summary: { type: String, default: "" },
    details: { type: String, default: "" },
    techStack: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
    isFeatured:  {type: Boolean, default: false, },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
