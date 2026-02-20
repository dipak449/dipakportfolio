const { Schema, model } = require("mongoose");

const factSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const aboutSectionSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "main" },
    imageUrl: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
    facts: { type: [factSchema], default: () => [] },
  },
  { timestamps: true }
);

module.exports = model("AboutSection", aboutSectionSchema);
