import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { ResumeAPI } from "../../services/resume.service";

const CV_DEFAULTS = {
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
};

function skillsToLines(items = []) {
  return (items || []).map((x) => `${x.name || ""} | ${Number(x.level || 0)}`).join("\n");
}

function linesToSkills(raw = "") {
  return raw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", level = "0"] = line.split("|").map((x) => x.trim());
      return { name, level: Number(level || 0) };
    });
}

function experienceToLines(items = []) {
  return (items || []).map((x) => `${x.year || ""} | ${x.company || ""} | ${x.role || ""}`).join("\n");
}

function linesToExperience(raw = "") {
  return raw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => {
      const [year = "", company = "", role = ""] = line.split("|").map((x) => x.trim());
      return { year, company, role };
    });
}

function listToLines(items = []) {
  return (items || []).join("\n");
}

function linesToList(raw = "") {
  return raw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function isProjectEntry(entry = {}) {
  const value = `${entry?.company || ""} ${entry?.role || ""}`.toLowerCase();
  return value.includes("project") || value.includes("portfolio") || value.includes("application") || value.includes("website") || value.includes("detection");
}

export default function ResumeAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["resume-admin"], queryFn: ResumeAPI.getAdmin });

  const [softwareLines, setSoftwareLines] = useState("");
  const [personalSkillsText, setPersonalSkillsText] = useState("");
  const [experienceLines, setExperienceLines] = useState("");
  const [projectLines, setProjectLines] = useState("");
  const [whatLines, setWhatLines] = useState("");
  const [designLines, setDesignLines] = useState("");
  const [hobbyLines, setHobbyLines] = useState("");
  const [educationTitle, setEducationTitle] = useState("");
  const [educationSubtitle, setEducationSubtitle] = useState("");

  function applyDefaults(values = CV_DEFAULTS) {
    const allExperiences = Array.isArray(values.experiences) ? values.experiences : [];
    const explicitProjects = Array.isArray(values.projects) ? values.projects : [];
    const normalizedProjects = explicitProjects.length ? explicitProjects : allExperiences.filter((x) => isProjectEntry(x));
    const normalizedExperiences = allExperiences.filter((x) => !isProjectEntry(x));

    setSoftwareLines(skillsToLines(values.softwareSkills));
    setPersonalSkillsText(values.personalSkillsText || "");
    setExperienceLines(experienceToLines(normalizedExperiences));
    setProjectLines(experienceToLines(normalizedProjects));
    setWhatLines(listToLines(values.whatCanIDo));
    setDesignLines(listToLines(values.designSkills));
    setHobbyLines(listToLines(values.hobbies));
    setEducationTitle(values.educationTitle || "");
    setEducationSubtitle(values.educationSubtitle || "");
  }

  useEffect(() => {
    if (!q.data) return;
    applyDefaults(q.data);
  }, [q.data]);

  const saveM = useMutation({
    mutationFn: ResumeAPI.update,
    onSuccess: () => {
      toast.success("Resume section updated");
      qc.invalidateQueries({ queryKey: ["resume-admin"] });
      qc.invalidateQueries({ queryKey: ["resume-public"] });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  if (q.isLoading) return <LoaderFull label="Loading resume section..." />;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Manage Resume</h2>

        <Card className="mt-6 p-5">
          <div className="grid gap-3">
            <textarea
              className="min-h-[140px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"Software skills: one per line\nPhotoshop | 95\nIllustrator | 88"}
              value={softwareLines}
              onChange={(e) => setSoftwareLines(e.target.value)}
            />

            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Personal skills line"
              value={personalSkillsText}
              onChange={(e) => setPersonalSkillsText(e.target.value)}
            />

            <textarea
              className="min-h-[160px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"Experience: one per line\n2014 | WHITE FISH ADVERTISING CO. | Art Director"}
              value={experienceLines}
              onChange={(e) => setExperienceLines(e.target.value)}
            />

            <textarea
              className="min-h-[160px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"Projects: one per line\n2024 | Blog Application (MERN) | Built auth, CRUD, REST APIs"}
              value={projectLines}
              onChange={(e) => setProjectLines(e.target.value)}
            />

            <textarea
              className="min-h-[110px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"What can I do: one per line\nLogo - Stationery - Branding"}
              value={whatLines}
              onChange={(e) => setWhatLines(e.target.value)}
            />

            <textarea
              className="min-h-[110px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"Design skills: one per line\nCreativity - Planing & Strategy"}
              value={designLines}
              onChange={(e) => setDesignLines(e.target.value)}
            />

            <textarea
              className="min-h-[100px] rounded-2xl border border-black/10 px-4 py-3"
              placeholder={"Hobbies: one per line\nReading\nPhotography"}
              value={hobbyLines}
              onChange={(e) => setHobbyLines(e.target.value)}
            />

            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Education title"
              value={educationTitle}
              onChange={(e) => setEducationTitle(e.target.value)}
            />

            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Education subtitle"
              value={educationSubtitle}
              onChange={(e) => setEducationSubtitle(e.target.value)}
            />

            <div className="flex justify-end gap-2 flex-wrap">
              <Button
                className="border border-[#6d7bff]/70 bg-[#6d7bff]/10 text-[#d5dbff]"
                onClick={() => applyDefaults(CV_DEFAULTS)}
                type="button"
              >
                Reset to My CV Defaults
              </Button>
              <Button
                className="bg-brand-500"
                onClick={() =>
                  saveM.mutate({
                    softwareSkills: linesToSkills(softwareLines),
                    personalSkillsText,
                    experiences: linesToExperience(experienceLines),
                    projects: linesToExperience(projectLines),
                    whatCanIDo: linesToList(whatLines),
                    designSkills: linesToList(designLines),
                    hobbies: linesToList(hobbyLines),
                    educationTitle,
                    educationSubtitle,
                  })
                }
                disabled={saveM.isPending}
              >
                {saveM.isPending ? "Saving..." : "Save Resume"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
