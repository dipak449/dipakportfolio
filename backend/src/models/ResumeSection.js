const { Schema, model } = require("mongoose");

const skillSchema = new Schema(
  {
    name: { type: String, default: "", trim: true },
    level: { type: Number, default: 50, min: 0, max: 100 },
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    year: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const resumeSectionSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "main" },
    softwareSkills: { type: [skillSchema], default: () => [] },
    personalSkillsText: { type: String, default: "", trim: true },
    experiences: { type: [experienceSchema], default: () => [] },
    projects: { type: [experienceSchema], default: () => [] },
    whatCanIDo: { type: [String], default: () => [] },
    designSkills: { type: [String], default: () => [] },
    hobbies: { type: [String], default: () => [] },
    educationTitle: { type: String, default: "", trim: true },
    educationSubtitle: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = model("ResumeSection", resumeSectionSchema);
