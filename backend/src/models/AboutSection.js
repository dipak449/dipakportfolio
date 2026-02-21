const { Schema, model } = require("mongoose");

const factSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const certificationSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    certificateUrl: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: true },
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
    certifications: { type: [certificationSchema], default: () => [] },
  },
  { timestamps: true }
);

module.exports = model("AboutSection", aboutSectionSchema);
