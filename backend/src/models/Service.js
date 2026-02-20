const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    launchDate: { type: Date, required: true },
    imageUrl: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema, "services");
