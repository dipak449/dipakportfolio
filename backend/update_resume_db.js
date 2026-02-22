require("dotenv").config();
const mongoose = require("mongoose");
const ResumeSection = require("./src/models/ResumeSection");

function normalizeEntry(entry = {}) {
  return {
    year: String(entry.year || "").trim(),
    company: String(entry.company || "").trim(),
    role: String(entry.role || "").trim(),
  };
}

function entryKey(entry = {}) {
  const e = normalizeEntry(entry);
  return `${e.year}||${e.company}||${e.role}`.toLowerCase();
}

function isProjectLike(entry = {}) {
  const text = `${entry.company || ""} ${entry.role || ""}`.toLowerCase();
  const projectSignals = [
    "project",
    "portfolio",
    "website",
    "application",
    "app",
    "mern",
    "ai/ml",
    "machine learning",
    "shopping",
    "detection",
  ];
  const experienceSignals = [
    "intern",
    "internship",
    "engineer",
    "developer",
    "analyst",
    "consultant",
    "assistant",
    "associate",
    "lead",
    "manager",
  ];

  const hasProjectSignal = projectSignals.some((s) => text.includes(s));
  const hasExperienceSignal = experienceSignals.some((s) => text.includes(s));
  return hasProjectSignal && !hasExperienceSignal;
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const doc = await ResumeSection.findOne({ singletonKey: "main" });

    if (!doc) {
      console.log("No resume document found with singletonKey=main. Nothing to migrate.");
      return;
    }

    const experiences = Array.isArray(doc.experiences) ? doc.experiences.map(normalizeEntry) : [];
    const existingProjects = Array.isArray(doc.projects) ? doc.projects.map(normalizeEntry) : [];
    const projectsByKey = new Map(existingProjects.map((p) => [entryKey(p), p]));

    const keptExperiences = [];
    const movedToProjects = [];

    experiences.forEach((exp) => {
      if (isProjectLike(exp)) {
        const key = entryKey(exp);
        if (!projectsByKey.has(key)) {
          projectsByKey.set(key, exp);
          movedToProjects.push(exp);
        }
      } else {
        keptExperiences.push(exp);
      }
    });

    doc.experiences = keptExperiences;
    doc.projects = Array.from(projectsByKey.values());

    // Cleanup old schema fields if still present in raw document.
    doc.set("phone", undefined, { strict: false });
    doc.set("languages", undefined, { strict: false });

    await doc.save();

    console.log("resume-db-migration-complete");
    console.log(`kept-experiences: ${doc.experiences.length}`);
    console.log(`projects-total: ${doc.projects.length}`);
    console.log(`moved-to-projects: ${movedToProjects.length}`);
    movedToProjects.forEach((item, i) => {
      console.log(
        `  ${i + 1}. [${item.year}] ${item.company}${item.role ? ` - ${item.role}` : ""}`
      );
    });
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error("resume-db-migration-failed");
  console.error(err.message || err);
  process.exit(1);
});
