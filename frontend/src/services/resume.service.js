import api from "./api";

function normalizeSkillRows(values = []) {
  return (Array.isArray(values) ? values : []).map((x) => ({
    name: x?.name || "",
    level: Number(x?.level || 0),
  }));
}

function normalize(item) {
  if (!item) return item;
  return {
    softwareSkills: normalizeSkillRows(item.softwareSkills),
    personalSkillsText: item.personalSkillsText || "",
    experiences: Array.isArray(item.experiences)
      ? item.experiences.map((x) => ({
          year: x?.year || "",
          company: x?.company || "",
          role: x?.role || "",
        }))
      : [],
    projects: Array.isArray(item.projects)
      ? item.projects.map((x) => ({
          year: x?.year || "",
          company: x?.company || "",
          role: x?.role || "",
        }))
      : [],
    whatCanIDo: Array.isArray(item.whatCanIDo) ? item.whatCanIDo : [],
    designSkills: Array.isArray(item.designSkills) ? item.designSkills : [],
    hobbies: Array.isArray(item.hobbies) ? item.hobbies : [],
    educationTitle: item.educationTitle || "",
    educationSubtitle: item.educationSubtitle || "",
  };
}

export const ResumeAPI = {
  getPublic: () => api.get("/resume/public").then((r) => normalize(r.data)),
  getAdmin: () => api.get("/resume/admin").then((r) => normalize(r.data)),
  update: (payload) => api.put("/resume/admin", payload).then((r) => normalize(r.data)),
};
