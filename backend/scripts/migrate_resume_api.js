const axios = require("axios");

const base = process.env.BASE_URL || "http://localhost:8002";
const email = process.env.ADMIN_EMAIL || "shahdipak449@gmail.com";
const password = process.env.ADMIN_PASSWORD || "shah449@dipak";

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

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const keyOf = (e) => [norm(e?.year), norm(e?.company), norm(e?.role)].join("||");

const dedupeEntries = (entries = []) => {
  const map = new Map();
  for (const e of entries) {
    const k = keyOf(e);
    if (!k || map.has(k)) continue;
    map.set(k, {
      year: String(e?.year || "").trim(),
      company: String(e?.company || "").trim(),
      role: String(e?.role || "").trim(),
    });
  }
  return Array.from(map.values());
};

async function run() {
  const { data: login } = await axios.post(`${base}/api/auth/admin/login`, {
    email,
    password,
  });
  const token = login?.token;
  if (!token) throw new Error("No auth token returned from /api/auth/admin/login");

  const headers = { Authorization: `Bearer ${token}` };
  const { data: resume } = await axios.get(`${base}/api/resume/admin`, { headers });

  const experiences = Array.isArray(resume.experiences) ? resume.experiences : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];

  const projectMap = new Map(projects.map((p) => [keyOf(p), p]));
  const keptExperiences = [];
  const movedToProjects = [];

  for (const exp of experiences) {
    const text = norm(`${exp?.company || ""} ${exp?.role || ""}`);
    const hasProjectSignal = projectSignals.some((s) => text.includes(s));
    const hasExperienceSignal = experienceSignals.some((s) => text.includes(s));
    if (hasProjectSignal && !hasExperienceSignal) {
      const k = keyOf(exp);
      if (!projectMap.has(k)) {
        projectMap.set(k, exp);
        movedToProjects.push(exp);
      }
    } else {
      keptExperiences.push(exp);
    }
  }

  const cleanedExperiences = dedupeEntries(keptExperiences);
  const cleanedProjects = dedupeEntries(Array.from(projectMap.values()));

  const payload = {
    softwareSkills: Array.isArray(resume.softwareSkills) ? resume.softwareSkills : [],
    personalSkillsText: resume.personalSkillsText || "",
    experiences: cleanedExperiences,
    projects: cleanedProjects,
    whatCanIDo: Array.isArray(resume.whatCanIDo) ? resume.whatCanIDo : [],
    designSkills: Array.isArray(resume.designSkills) ? resume.designSkills : [],
    hobbies: Array.isArray(resume.hobbies) ? resume.hobbies : [],
    educationTitle: resume.educationTitle || "",
    educationSubtitle: resume.educationSubtitle || "",
  };

  const { data: updated } = await axios.put(`${base}/api/resume/admin`, payload, { headers });

  console.log("resume-api-migration-complete");
  console.log(`moved-to-projects=${movedToProjects.length}`);
  console.log(`experiences=${updated.experiences?.length || 0}`);
  console.log(`projects=${updated.projects?.length || 0}`);

  for (const item of updated.experiences || []) {
    console.log(`exp=[${item.year}] ${item.company} - ${item.role}`);
  }
  for (const item of updated.projects || []) {
    console.log(`proj=[${item.year}] ${item.company} - ${item.role}`);
  }
}

run().catch((err) => {
  console.error("resume-api-migration-failed");
  console.error(err.response?.data || err.message || err);
  process.exit(1);
});
