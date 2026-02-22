const { Schema, model } = require("mongoose");

const homePageSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "main" },
    name: { type: String, default: "Dipak Sah", trim: true },
    title: { type: String, default: "I AM FULL STACK DEVELOPER", trim: true },
    subtitle: { type: String, default: "A Creative Freelancer & Full Stack Developer", trim: true },
    profileImageUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = model("HomePage", homePageSchema);
