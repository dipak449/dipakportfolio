const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    coverImageUrl: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
