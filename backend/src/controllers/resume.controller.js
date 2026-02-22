const ResumeSection = require("../models/ResumeSection");

function cleanText(value = "", max = 200) {
  return String(value || "").trim().slice(0, max);
}

function cleanLines(values = [], maxItems = 12, maxLen = 120) {
  return (Array.isArray(values) ? values : [])
    .map((x) => cleanText(x, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeSkills(values = [], maxItems = 10) {
  return (Array.isArray(values) ? values : [])
    .map((x) => ({
      name: cleanText(x?.name || "", 80),
      level: Math.max(0, Math.min(100, Number(x?.level || 0))),
    }))
    .filter((x) => x.name)
    .slice(0, maxItems);
}

function normalizeExperiences(values = [], maxItems = 10) {
  return (Array.isArray(values) ? values : [])
    .map((x) => ({
      year: cleanText(x?.year || "", 30),
      company: cleanText(x?.company || "", 120),
      role: cleanText(x?.role || "", 120),
    }))
    .filter((x) => x.company || x.role || x.year)
    .slice(0, maxItems);
}

async function getOrCreate() {
  let doc = await ResumeSection.findOne({ singletonKey: "main" });
  if (!doc) {
    doc = await ResumeSection.create({
      singletonKey: "main",
      softwareSkills: [
        { name: "React.js", level: 90 },
        { name: "Node.js / Express.js", level: 88 },
        { name: "MongoDB", level: 86 },
        { name: "Python", level: 82 },
        { name: "REST API Development", level: 90 },
      ],
      personalSkillsText: "Clean Code - Team Work - Problem Solving",
      experiences: [
        { year: "2024", company: "IIDT", role: "Full Stack Web Developer Intern" },
      ],
      projects: [
        { year: "2024", company: "Blog Application (MERN)", role: "Built auth, CRUD, REST APIs, responsive UI" },
        { year: "2024", company: "Sign Language Detection (AI/ML)", role: "Machine learning + computer vision workflow" },
        { year: "2023", company: "Online Shopping Website", role: "Cart, checkout, secure payment integration" },
        { year: "2023", company: "Personal Portfolio Website", role: "Responsive UI/UX, animations, performance optimization" },
      ],
      whatCanIDo: [
        "Build full-stack MERN web applications",
        "Design and integrate RESTful APIs",
        "Create responsive and accessible frontend UI",
      ],
      designSkills: [
        "Database design with MongoDB and MySQL",
        "Git/GitHub collaborative development",
        "Performance optimization and clean architecture",
      ],
      hobbies: ["Reading", "Coding", "Travel", "Tech Research"],
      educationTitle: "Bachelor of Computer Science and Engineering - Sri Venkateswara College of Engineering and Technology",
      educationSubtitle: "JNTUA (2022 - Present) | GPA: 3.48 / 4.0",
    });
  }
  return doc;
}

function toResponse(doc) {
  return {
    softwareSkills: Array.isArray(doc.softwareSkills) ? doc.softwareSkills : [],
    personalSkillsText: doc.personalSkillsText || "",
    experiences: Array.isArray(doc.experiences) ? doc.experiences : [],
    projects: Array.isArray(doc.projects) ? doc.projects : [],
    whatCanIDo: Array.isArray(doc.whatCanIDo) ? doc.whatCanIDo : [],
    designSkills: Array.isArray(doc.designSkills) ? doc.designSkills : [],
    hobbies: Array.isArray(doc.hobbies) ? doc.hobbies : [],
    educationTitle: doc.educationTitle || "",
    educationSubtitle: doc.educationSubtitle || "",
  };
}

exports.getPublic = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    if (typeof req.body.personalSkillsText === "string") {
      doc.personalSkillsText = cleanText(req.body.personalSkillsText, 300);
    }
    if (Array.isArray(req.body.softwareSkills)) doc.softwareSkills = normalizeSkills(req.body.softwareSkills, 12);
    if (Array.isArray(req.body.experiences)) doc.experiences = normalizeExperiences(req.body.experiences, 12);
    if (Array.isArray(req.body.projects)) doc.projects = normalizeExperiences(req.body.projects, 12);
    if (Array.isArray(req.body.whatCanIDo)) doc.whatCanIDo = cleanLines(req.body.whatCanIDo, 10, 120);
    if (Array.isArray(req.body.designSkills)) doc.designSkills = cleanLines(req.body.designSkills, 10, 120);
    if (Array.isArray(req.body.hobbies)) doc.hobbies = cleanLines(req.body.hobbies, 8, 40);
    if (typeof req.body.educationTitle === "string") doc.educationTitle = cleanText(req.body.educationTitle, 140);
    if (typeof req.body.educationSubtitle === "string") doc.educationSubtitle = cleanText(req.body.educationSubtitle, 140);

    await doc.save();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};
