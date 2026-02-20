const { Schema, model } = require("mongoose");

const socialLinksSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "main" },
    githubUrl: { type: String, default: "", trim: true },
    linkedinUrl: { type: String, default: "", trim: true },
    facebookUrl: { type: String, default: "", trim: true },
    instagramUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = model("SocialLinks", socialLinksSchema);

