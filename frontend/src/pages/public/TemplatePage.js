import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BookOpen,
  Camera,
  Clapperboard,
  Code2,
  Database,
  Facebook,
  FileImage,
  Github,
  Instagram,
  Linkedin,
  Palette,
  PenTool,
  Plane,
  Server,
} from "lucide-react";
import PageHead from "../../components/common/PageHead";
import { MessagesAPI } from "../../services/messages.service";
import { GalleryAPI } from "../../services/gallery.service";
import { ServicesAPI } from "../../services/services.service";
import { PostsAPI } from "../../services/posts.service";
import { HomePageAPI } from "../../services/homepage.service";
import { AboutAPI } from "../../services/about.service";
import { SocialLinksAPI } from "../../services/social-links.service";
import { ResumeAPI } from "../../services/resume.service";
import { getImageFallbackCandidates } from "../../utils/imageUrl";

function slugify(value = "") {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function projectSlug(item, index = 0) {
  return slugify(item?.title || `project-${index + 1}`);
}

function serviceSlug(item, index = 0) {
  return slugify(item?.title || `service-${index + 1}`);
}

function certificationSlug(item, index = 0) {
  return slugify(item?.title || `certification-${index + 1}`);
}

function setNextImageFallback(event) {
  const img = event.currentTarget;
  const raw = img.dataset.rawsrc || img.src || "";
  const candidates = getImageFallbackCandidates(raw);
  const tried = Number(img.dataset.tryIndex || "0");
  const next = candidates[tried + 1];
  if (next) {
    img.dataset.tryIndex = String(tried + 1);
    img.src = next;
  }
}

function getSkillIconForName(name = "") {
  const value = String(name || "").toLowerCase();

  if (value.includes("react") || value.includes("javascript") || value.includes("typescript") || value.includes("frontend")) {
    return Code2;
  }
  if (value.includes("node") || value.includes("express") || value.includes("api") || value.includes("backend")) {
    return Server;
  }
  if (value.includes("mongo") || value.includes("sql") || value.includes("database")) {
    return Database;
  }
  if (value.includes("python")) {
    return Github;
  }
  if (value.includes("design") || value.includes("photoshop") || value.includes("illustrator") || value.includes("figma")) {
    return PenTool;
  }
  if (value.includes("video") || value.includes("premiere") || value.includes("after effect")) {
    return Clapperboard;
  }
  if (value.includes("image") || value.includes("indesign")) {
    return FileImage;
  }

  return Palette;
}

export default function TemplatePage({ page = "home" }) {
  const { slug = "" } = useParams();
  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const resolvedPage = page === "projectDetails" ? "project" : page;

  const contactQ = useQuery({
    queryKey: ["contact-info-public"],
    queryFn: MessagesAPI.contactInfo,
    enabled: page === "home" || page === "about" || page === "contact",
  });
  const projectsQ = useQuery({
    queryKey: ["public-projects"],
    queryFn: GalleryAPI.list,
    enabled: page === "home" || page === "project" || page === "projectDetails",
  });
  const postsQ = useQuery({ queryKey: ["public-posts"], queryFn: PostsAPI.listPublished, enabled: page === "home" || page === "blog" });
  const serviceQ = useQuery({
    queryKey: ["public-services"],
    queryFn: ServicesAPI.list,
    enabled: page === "home" || page === "service",
  });
  const homepageQ = useQuery({
    queryKey: ["homepage-public"],
    queryFn: HomePageAPI.getPublic,
    enabled: page === "home",
  });
  const aboutQ = useQuery({
    queryKey: ["about-public"],
    queryFn: AboutAPI.getPublic,
    enabled: page === "home" || page === "about" || page === "certifications",
  });
  const socialQ = useQuery({
    queryKey: ["social-links-public"],
    queryFn: SocialLinksAPI.getPublic,
    enabled: page === "home" || page === "contact",
  });
  const resumeQ = useQuery({
    queryKey: ["resume-public"],
    queryFn: ResumeAPI.getPublic,
    enabled: page === "resume",
  });

  const sendMessageM = useMutation({
    mutationFn: MessagesAPI.send,
    onSuccess: () => {
      toast.success("Message sent");
      setContactForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to send message"),
  });

  const pageMeta = {
    home: { title: "Home", subtitle: "Portfolio", description: "Portfolio home" },
    about: { title: "About", subtitle: "Profile", description: "About page" },
    resume: { title: "Resume", subtitle: "Resume", description: "Resume page" },
    service: { title: "Service", subtitle: "Services", description: "Service page" },
    project: { title: "Project", subtitle: "Projects", description: "Project page" },
    blog: { title: "Blog", subtitle: "Blog", description: "Blog page" },
    contact: { title: "Contact", subtitle: "Contact", description: "Contact page" },
  };
  const templateCfg = pageMeta[resolvedPage] || pageMeta.home;
  const cfg = {
    title: templateCfg.title || "Portfolio",
    subtitle: templateCfg.subtitle || "Personal portfolio",
    description: templateCfg.description || "",
  };

  const hero = {
    name: homepageQ.data?.name || "Dipak Sah",
    title: homepageQ.data?.title || "I AM FULL STACK DEVELOPER",
    subtitle: homepageQ.data?.subtitle || "A Creative Freelancer & Full Stack Developer",
    backgroundImageUrl: "",
    personImageUrl: homepageQ.data?.profileImageUrl || "",
  };
  const path = page === "home"
    ? "/"
    : page === "projectDetails"
      ? `/project/${slug}`
      : page === "certifications" && slug
        ? `/certifications/${slug}`
        : `/${resolvedPage === "project" ? "project" : page}`;
  const profileName = hero.name || "Dipak Sah";
  const firstName = profileName.split(/\s+/).filter(Boolean)[0] || "Dipak";
  const aboutPrimary = {
    imageUrl: aboutQ.data?.imageUrl || "",
    description: aboutQ.data?.description || "",
  };
  const aboutFacts = Array.isArray(aboutQ.data?.facts)
    ? aboutQ.data.facts.map((x) => ({ title: x.label || "", meta: x.value || "" }))
    : [];
  const contactInfo = contactQ.data || {};
  const social = socialQ.data || {};

  const projectItems = useMemo(
    () =>
      (projectsQ.data || []).map((p) => ({
        title: p.title || "Project",
        album: p.album || "",
        description: p.summary || "",
        details: p.details || p.summary || "",
        techStack: p.techStack || "",
        imageUrl: p.imageUrl || "",
        liveUrl: p.liveUrl || "",
        sourceUrl: p.sourceUrl || "",
        isFeatured: !!p.isFeatured,
      })),
    [projectsQ.data]
  );
  const serviceItems = useMemo(
    () =>
      (serviceQ.data || []).map((s) => ({
        title: s.title || "Service",
        description: s.description || "",
        imageUrl: s.imageUrl || "",
      })),
    [serviceQ.data]
  );
  const blogItems = useMemo(
    () =>
      (postsQ.data || []).map((p) => ({
        title: p.title || "Untitled",
        description: p.excerpt || p.content || "",
        content: p.content || "",
        imageUrl: p.coverImageUrl || "",
        slug: p.slug || "",
        isFeatured: !!p.isFeatured,
      })),
    [postsQ.data]
  );
  const certificationItems = useMemo(
    () =>
      ((aboutQ.data?.certifications || []).filter((x) => x?.isPublished !== false)).map((c) => ({
        title: c?.title || "Certification",
        description: c?.description || "",
        certificateUrl: c?.certificateUrl || "",
      })),
    [aboutQ.data]
  );
  const featuredProjectItems = useMemo(
    () => projectItems.filter((item) => !!item.isFeatured),
    [projectItems]
  );
  const featuredBlogItems = useMemo(
    () => blogItems.filter((item) => !!item.isFeatured),
    [blogItems]
  );
  const resumeDownloadUrl = aboutQ.data?.resumeUrl || "";
  const resumeDownloadEndpoint = `${process.env.REACT_APP_API_URL || "http://localhost:8002/api"}/about/resume-download`;
  const resumeData = resumeQ.data || {};
  const isProjectEntry = (entry = {}) => {
    const v = `${entry?.company || ""} ${entry?.role || ""}`.toLowerCase();
    return v.includes("project") || v.includes("portfolio") || v.includes("application") || v.includes("website") || v.includes("detection");
  };
  const baseExperiences = Array.isArray(resumeData.experiences) && resumeData.experiences.length
    ? resumeData.experiences
    : [
        { year: "2024", company: "IIDT", role: "Full Stack Web Developer Intern" },
      ];
  const baseProjects = Array.isArray(resumeData.projects) && resumeData.projects.length
    ? resumeData.projects
    : baseExperiences.filter((x) => isProjectEntry(x)).length
      ? baseExperiences.filter((x) => isProjectEntry(x))
    : [
        { year: "2024", company: "Blog Application (MERN)", role: "Built auth, CRUD, REST APIs, responsive UI" },
        { year: "2024", company: "Sign Language Detection (AI/ML)", role: "Machine learning + computer vision workflow" },
        { year: "2023", company: "Online Shopping Website", role: "Cart, checkout, secure payment integration" },
        { year: "2023", company: "Personal Portfolio Website", role: "Responsive UI/UX, animations, performance optimization" },
      ];

  const resume = {
    softwareSkills: Array.isArray(resumeData.softwareSkills) && resumeData.softwareSkills.length
      ? resumeData.softwareSkills
      : [
          { name: "React.js", level: 90 },
          { name: "Node.js / Express.js", level: 88 },
          { name: "MongoDB", level: 86 },
          { name: "Python", level: 82 },
          { name: "REST API Development", level: 90 },
        ],
    personalSkillsText:
      resumeData.personalSkillsText || "Clean Code - Team Work - Problem Solving",
    experiences: baseExperiences.filter((x) => !isProjectEntry(x)),
    projects: baseProjects,
    whatCanIDo: Array.isArray(resumeData.whatCanIDo) && resumeData.whatCanIDo.length
      ? resumeData.whatCanIDo
      : [
          "Build full-stack MERN web applications",
          "Design and integrate RESTful APIs",
          "Create responsive and accessible frontend UI",
        ],
    designSkills: Array.isArray(resumeData.designSkills) && resumeData.designSkills.length
      ? resumeData.designSkills
      : [
          "Database design with MongoDB and MySQL",
          "Git/GitHub collaborative development",
          "Performance optimization and clean architecture",
        ],
    hobbies: Array.isArray(resumeData.hobbies) && resumeData.hobbies.length
      ? resumeData.hobbies
      : ["Reading", "Coding", "Travel", "Tech Research"],
    educationTitle:
      resumeData.educationTitle ||
      "Bachelor of Computer Science and Engineering - Sri Venkateswara College of Engineering and Technology",
    educationSubtitle: resumeData.educationSubtitle || "JNTUA (2022 - Present) | GPA: 3.48 / 4.0",
  };

  const hobbyIconMap = {
    reading: BookOpen,
    photography: Camera,
    drawing: PenTool,
    travel: Plane,
  };

  const submitContact = (event) => {
    event.preventDefault();
    const name = `${contactForm.firstName} ${contactForm.lastName}`.trim();
    if (!name || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error("Name, email, and message are required");
      return;
    }
    sendMessageM.mutate({
      name,
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim(),
    });
  };

  const aboutBlock = (
    <section className="yazen-about" id="about">
      <div className="yazen-container">
        <div className="yazen-about-grid">
          <motion.div className="yazen-about-copy" initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }}>
            <div className="yazen-section-head">
              <span className="yazen-kicker">Discover</span>
              <h2>About Me</h2>
              <div className="yazen-title-line" />
            </div>
            <p>{aboutPrimary.description || "Learn more about my journey, profile, and background."}</p>
            <div className="yazen-info-grid">
              {aboutFacts.length ? aboutFacts.map((entry, index) => (
                <div key={`${entry.title}-${index}`}><strong>{entry.title || "Detail"}:</strong> {entry.meta || entry.subtitle || entry.description || "-"}</div>
              )) : (
                <>
                  <div><strong>Name:</strong> {profileName}</div>
                  <div><strong>Email:</strong> {contactInfo.email || "your@email.com"}</div>
                  <div><strong>Phone:</strong> {contactInfo.phone || "+1 000 000 0000"}</div>
                  <div><strong>Location:</strong> {contactInfo.location || "Your location"}</div>
                </>
              )}
            </div>
          </motion.div>
          <motion.div className="yazen-about-image" initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }}>
            <img src={aboutPrimary.imageUrl || ""} alt={profileName} loading="lazy" decoding="async" data-rawsrc={aboutPrimary.imageUrl || ""} data-try-index="0" onError={setNextImageFallback} />
          </motion.div>
        </div>
      </div>
    </section>
  );

  const certificationsBlock = (
    <section className="yazen-home-preview yazen-certifications-preview">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">Highlights</span>
          <h2>Certifications</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="wix-grid">
          {certificationItems.length ? certificationItems.map((item, i) => (
            <motion.article key={`${item.title}-${i}`} className="wix-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.05 }}>
              {item.certificateUrl ? <Link to={`/certifications/${certificationSlug(item, i)}`}><img src={item.certificateUrl} alt={item.title} className="wix-card-img yazen-cert-card-img" loading="lazy" decoding="async" data-rawsrc={item.certificateUrl} data-try-index="0" onError={setNextImageFallback} /></Link> : null}
              <h3>{item.title}</h3>
              <p>{item.description || "No description"}</p>
              <Link className="wix-link" to={`/certifications/${certificationSlug(item, i)}`}>View Certificate</Link>
            </motion.article>
          )) : <div className="wix-empty">No certifications added yet.</div>}
        </div>
      </div>
    </section>
  );

  const serviceBlock = (
    <section className="yazen-services" id="service">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">What I Do</span>
          <h2>My Services</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="yazen-service-grid">
          {serviceItems.length ? serviceItems.map((service, i) => (
            <motion.article key={`${service.title}-${i}`} className="yazen-service-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.08 }}>
              {service.imageUrl ? (
                <Link to={`/service/${serviceSlug(service, i)}`}>
                  <img src={service.imageUrl} alt={service.title} className="wix-card-img" loading="lazy" decoding="async" data-rawsrc={service.imageUrl} data-try-index="0" onError={setNextImageFallback} />
                </Link>
              ) : (
                <div className="yazen-service-icon">*</div>
              )}
              <h3>{service.title || "Service"}</h3>
              <p>{service.description || "Manage this from Admin > Services."}</p>
              <Link className="wix-link" to={`/service/${serviceSlug(service, i)}`}>View Detail</Link>
            </motion.article>
          )) : <div className="wix-empty">Add services from Admin &gt; Service.</div>}
        </div>
      </div>
    </section>
  );

  const projectBlock = (
    <section className="yazen-home-preview">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">Selected Work</span>
          <h2>Featured Projects</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="wix-grid">
          {projectItems.length ? projectItems.map((project, i) => (
            <motion.article key={`${project.title}-${i}`} className="wix-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.06 }}>
              {project.imageUrl ? <Link to={`/project/${projectSlug(project, i)}`}><img src={project.imageUrl} alt={project.title} className="wix-card-img" loading="lazy" decoding="async" data-rawsrc={project.imageUrl} data-try-index="0" onError={setNextImageFallback} /></Link> : null}
              <h3>{project.title}</h3>
              <Link className="wix-link" to={`/project/${projectSlug(project, i)}`}>View Detail</Link>
            </motion.article>
          )) : <div className="wix-empty">Add projects from Admin &gt; Project.</div>}
        </div>
      </div>
    </section>
  );

  const projectHomeBlock = (
    <section className="yazen-home-preview">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">Selected Work</span>
          <h2>Featured Projects</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="wix-grid">
          {featuredProjectItems.length ? featuredProjectItems.map((project, i) => (
            <motion.article key={`${project.title}-${i}`} className="wix-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.06 }}>
              {project.imageUrl ? <Link to={`/project/${projectSlug(project, i)}`}><img src={project.imageUrl} alt={project.title} className="wix-card-img" loading="lazy" decoding="async" data-rawsrc={project.imageUrl} data-try-index="0" onError={setNextImageFallback} /></Link> : null}
              <h3>{project.title}</h3>
              <Link className="wix-link" to={`/project/${projectSlug(project, i)}`}>View Detail</Link>
            </motion.article>
          )) : <div className="wix-empty">Set featured projects from Admin &gt; Project.</div>}
        </div>
        <div className="yazen-home-links">
          <Link className="wix-link" to="/project">View all Projects</Link>
        </div>
      </div>
    </section>
  );

  const blogBlock = (
    <section className="yazen-home-preview yazen-home-preview-blog">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">Insights</span>
          <h2>Latest Blogs</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="wix-grid">
          {blogItems.length ? blogItems.map((item, idx) => (
            <motion.article key={`${item.title}-${idx}`} className="wix-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: idx * 0.05 }}>
              {item.imageUrl ? <Link to={`/blog/${item.slug}`}><img src={item.imageUrl} alt={item.title} className="wix-card-img" loading="lazy" decoding="async" data-rawsrc={item.imageUrl} data-try-index="0" onError={setNextImageFallback} /></Link> : null}
              <h3>{item.title}</h3>
              <p>{item.description || ""}</p>
              <Link className="wix-link" to={`/blog/${item.slug}`}>Read More</Link>
            </motion.article>
          )) : <div className="wix-empty">Add blog posts from Admin &gt; Blog.</div>}
        </div>
      </div>
    </section>
  );

  const blogHomeBlock = (
    <section className="yazen-home-preview yazen-home-preview-blog">
      <div className="yazen-container">
        <div className="yazen-section-head">
          <span className="yazen-kicker">Insights</span>
          <h2>Latest Blogs</h2>
          <div className="yazen-title-line" />
        </div>
        <div className="wix-grid">
          {featuredBlogItems.length ? featuredBlogItems.map((item, idx) => (
            <motion.article key={`${item.title}-${idx}`} className="wix-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: idx * 0.05 }}>
              {item.imageUrl ? <Link to={`/blog/${item.slug}`}><img src={item.imageUrl} alt={item.title} className="wix-card-img" loading="lazy" decoding="async" data-rawsrc={item.imageUrl} data-try-index="0" onError={setNextImageFallback} /></Link> : null}
              <h3>{item.title}</h3>
              <p>{item.description || ""}</p>
              <Link className="wix-link" to={`/blog/${item.slug}`}>Read More</Link>
            </motion.article>
          )) : <div className="wix-empty">Set featured blogs from Admin &gt; Blog.</div>}
        </div>
        <div className="yazen-home-links">
          <Link className="wix-link" to="/blog">View all Blogs</Link>
        </div>
      </div>
    </section>
  );

  const resumeBlock = (
    <section className="resume-shell">
      <div className="resume-topbar">
        <div className="resume-topbar-title">Resume Snapshot</div>
      </div>

      <div className="resume-grid">
        <div className="resume-col">
          <div className="resume-section">
            <h3>SOFTWARE SKILLS</h3>
            <div className="resume-skill-list">
              {(resume.softwareSkills || []).map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="resume-skill-item">
                  <div className="resume-skill-row">
                    <span className="resume-skill-icon">
                      {(() => {
                        const SkillIcon = getSkillIconForName(item?.name);
                        return <SkillIcon size={13} />;
                      })()}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <div className="resume-bar">
                    <i style={{ width: `${Math.max(0, Math.min(100, Number(item.level || 0)))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-section">
            <h3>PROJECTS</h3>
            <div className="resume-exp-list">
              {(resume.projects || []).map((item, idx) => (
                <div key={`${item.company}-${idx}`} className="resume-exp-item">
                  <div className="resume-exp-year">{item.year}</div>
                  <div>
                    <div className="resume-exp-company">{item.company}</div>
                    <div className="resume-exp-role">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="resume-col">
          <div className="resume-section">
            <h3>EXPERIENCE</h3>
            <div className="resume-exp-list">
              {(resume.experiences || []).map((item, idx) => (
                <div key={`${item.company}-${idx}`} className="resume-exp-item">
                  <div className="resume-exp-year">{item.year}</div>
                  <div>
                    <div className="resume-exp-company">{item.company}</div>
                    <div className="resume-exp-role">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-section">
            <h3>EDUCATION</h3>
            <p className="resume-edu-title">{resume.educationTitle || "BS/MS in Computer Science,"}</p>
            <p className="resume-edu-sub">{resume.educationSubtitle || "University of Maryland"}</p>
            <div className="resume-edu-actions resume-edu-actions-below resume-edu-actions-desktop">
              {resumeDownloadUrl ? <a href={resumeDownloadEndpoint} className="resume-edu-btn">Download CV</a> : <span className="resume-edu-btn">Download CV</span>}
              <Link className="resume-edu-btn" to="/certifications">View Certifications</Link>
            </div>
          </div>
        </div>

        <div className="resume-col">
          <div className="resume-section">
            <h3>WHAT CAN I DO ?</h3>
            <div className="resume-lines">
              {(resume.whatCanIDo || []).map((line, idx) => <p key={`${line}-${idx}`}>{line}</p>)}
            </div>
          </div>

          <div className="resume-section">
            <h3>DESIGN SKILLS</h3>
            <div className="resume-lines">
              {(resume.designSkills || []).map((line, idx) => <p key={`${line}-${idx}`}>{line}</p>)}
            </div>
          </div>

          <div className="resume-section">
            <h3>HOBBIES & INTERESTS</h3>
            <div className="resume-hobby-grid">
              {(resume.hobbies || []).map((item, idx) => {
                const Icon = hobbyIconMap[String(item || "").toLowerCase()] || BookOpen;
                return (
                  <div key={`${item}-${idx}`} className="resume-hobby">
                    <span><Icon size={14} /></span>
                    <small>{item}</small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="resume-section">
            <h3>PERSONAL SKILLS</h3>
            <p className="resume-text-line">{resume.personalSkillsText || "Creativity - Team Work - organisation"}</p>
            <div className="resume-edu-actions resume-edu-actions-below resume-edu-actions-mobile">
              {resumeDownloadUrl ? <a href={resumeDownloadEndpoint} className="resume-edu-btn">Download CV</a> : <span className="resume-edu-btn">Download CV</span>}
              <Link className="resume-edu-btn" to="/certifications">View Certifications</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (page === "home") {
    const homeBg = hero.backgroundImageUrl || "";
    const homeHeroTitle = hero.title || profileName;
    const homeHeroSubtitle = hero.subtitle || "A Creative Freelancer & Full Stack Developer";
    return (
      <div className="yazen-page-shell yazen-home-shell">
        <PageHead title={`${firstName} Portfolio`} description={cfg.description || cfg.subtitle} path={path} />
        <section className="yazen-hero" style={homeBg ? { backgroundImage: `url(${homeBg})` } : undefined}>
          <div className="yazen-hero-overlay" />
          <div className="yazen-hero-inner yazen-hero-split">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="yazen-hero-copy">
              <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="yazen-hero-owner">
                {profileName}
              </motion.h2>
              <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{homeHeroTitle || profileName}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>{homeHeroSubtitle}</motion.p>
              <div className="yazen-hero-cta">
                <Link className="yazen-primary-btn" to="/project">Explore Projects</Link>
                <Link className="yazen-primary-btn yazen-primary-btn-ghost" to="/resume">Resume</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.52 }} className="yazen-hero-visual">
              <div className="yazen-avatar-wrap">
                <img src={hero.personImageUrl || aboutPrimary.imageUrl || ""} alt={profileName} loading="eager" decoding="async" data-rawsrc={hero.personImageUrl || aboutPrimary.imageUrl || ""} data-try-index="0" onError={setNextImageFallback} />
              </div>
            </motion.div>
            <div className="yazen-hero-cta yazen-hero-cta-mobile">
              <Link className="yazen-primary-btn" to="/project">Explore Projects</Link>
              <Link className="yazen-primary-btn yazen-primary-btn-ghost" to="/resume">Resume</Link>
            </div>
            <a className="yazen-scroll-cue" href="#about">Scroll Down</a>
          </div>
        </section>
        {aboutBlock}
        {serviceBlock}
        {projectHomeBlock}
        {blogHomeBlock}
        <section className="wix-contact-page-wrap">
          <div className="wix-home-overlay" />
          <div className="wix-contact-page-card">
            <div className="wix-home-contact-left">
              <h3>Contact</h3>
              <p>Reach out for collaboration, projects, or opportunities.</p>
              {contactInfo.email ? <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p> : null}
              {contactInfo.phone ? <p><strong>Phone:</strong> <a href={`tel:${String(contactInfo.phone).replace(/\s+/g, "")}`}>{contactInfo.phone}</a></p> : null}
              {contactInfo.location ? <p>{contactInfo.location}</p> : null}
              <div className="mt-10 sm:mt-24 flex items-center gap-4">
                {social.githubUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.githubUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">GitHub</span>
                  </div>
                ) : null}
                {social.linkedinUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.linkedinUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">LinkedIn</span>
                  </div>
                ) : null}
                {social.facebookUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.facebookUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="Facebook">
                      <Facebook size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">Facebook</span>
                  </div>
                ) : null}
                {social.instagramUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.instagramUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="Instagram">
                      <Instagram size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">Instagram</span>
                  </div>
                ) : null}
              </div>
            </div>
            <form className="wix-home-contact-form" onSubmit={submitContact}>
              <div><label>First name *</label><input value={contactForm.firstName} onChange={(e) => setContactForm((prev) => ({ ...prev, firstName: e.target.value }))} /></div>
              <div><label>Last name *</label><input value={contactForm.lastName} onChange={(e) => setContactForm((prev) => ({ ...prev, lastName: e.target.value }))} /></div>
              <div className="full"><label>Email *</label><input type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} /></div>
              <div className="full"><label>Subject</label><input value={contactForm.subject} onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))} /></div>
              <div className="full"><label>Message *</label><textarea value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} /></div>
              <button className="full" type="submit" disabled={sendMessageM.isPending}>{sendMessageM.isPending ? "Sending..." : "Send"}</button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  if (page === "about") {
    return <div className="yazen-page-shell"><PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />{aboutBlock}</div>;
  }
  if (page === "resume") {
    return <div className="yazen-page-shell"><PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />{resumeBlock}</div>;
  }
  if (page === "service") {
    return <div className="yazen-page-shell"><PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />{serviceBlock}</div>;
  }
  if (page === "project") {
    return <div className="yazen-page-shell"><PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />{projectBlock}</div>;
  }

  if (page === "projectDetails") {
    const project = projectItems.find((x, i) => projectSlug(x, i) === slug);
    if (!project) {
      return <div className="wix-page yazen-page-shell"><PageHead title="Project Not Found" description="Project not found." path={path} /><section className="wix-section"><div className="wix-empty">This project does not exist.</div><Link className="wix-link" to="/project">Back to Project</Link></section></div>;
    }
    return (
      <div className="wix-page yazen-page-shell">
        <PageHead title={project.title || "Project"} description={project.description || ""} path={path} />
        <section className="wix-section yazen-section-body">
          <div className="wix-card">
            {project.imageUrl ? <img src={project.imageUrl} alt={project.title || "project"} className="wix-card-img wix-project-detail-image" loading="lazy" decoding="async" data-rawsrc={project.imageUrl} data-try-index="0" onError={setNextImageFallback} /> : null}
            <div className="wix-project-detail-card">
              <p className="wix-project-detail-description">{project.details || project.description || "No description provided."}</p>
              <div className="wix-project-detail-meta">
                {project.album ? <span className="wix-project-detail-pill"><strong>Category</strong>{project.album}</span> : null}
                {project.techStack ? <span className="wix-project-detail-pill"><strong>Tech Stack</strong>{project.techStack}</span> : null}
              </div>
              <div className="wix-project-detail-actions">
                {project.liveUrl ? <a className="wix-link wix-link-btn" href={project.liveUrl} target="_blank" rel="noreferrer">Live Preview</a> : null}
                {project.sourceUrl ? <a className="wix-link wix-link-btn" href={project.sourceUrl} target="_blank" rel="noreferrer">View this project in GitHub</a> : null}
                <Link className="wix-link wix-link-btn" to="/project">Back to Project</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (page === "serviceDetails") {
    const service = serviceItems.find((x, i) => serviceSlug(x, i) === slug);
    if (!service) {
      return <div className="wix-page yazen-page-shell"><PageHead title="Service Not Found" description="Service not found." path={path} /><section className="wix-section"><div className="wix-empty">This service does not exist.</div><Link className="wix-link" to="/service">Back to Service</Link></section></div>;
    }
    return (
      <div className="wix-page yazen-page-shell">
        <PageHead title={service.title || "Service"} description={service.description || ""} path={path} />
        <section className="wix-section yazen-section-body">
          <div className="wix-card">
            {service.imageUrl ? <img src={service.imageUrl} alt={service.title || "service"} className="wix-project-detail-image" loading="lazy" decoding="async" data-rawsrc={service.imageUrl} data-try-index="0" onError={setNextImageFallback} /> : null}
            <div className="wix-project-detail-card">
              <p>{service.description || "No description provided."}</p>
              <div className="wix-project-detail-actions">
                <Link className="wix-link" to="/service">Back to Service</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (page === "blog" && slug) {
    const post = blogItems.find((b) => b.slug === slug);
    if (!post) {
      return <div className="wix-page yazen-page-shell"><PageHead title="Blog Not Found" description="Blog not found." path={path} /><section className="wix-section"><div className="wix-empty">This blog is missing or unpublished.</div><Link className="wix-link" to="/blog">Back to Blog</Link></section></div>;
    }
    return (
      <div className="wix-page yazen-page-shell">
        <PageHead title={post.title} description={post.description} path={path} />
        <section className="wix-section yazen-section-body">
          {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="wix-project-detail-image" loading="lazy" decoding="async" data-rawsrc={post.imageUrl} data-try-index="0" onError={setNextImageFallback} /> : null}
          <p style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>{post.content || post.description}</p>
          <Link className="wix-link" to="/blog">Back to Blog</Link>
        </section>
      </div>
    );
  }

  if (page === "blog") {
    return <div className="yazen-page-shell"><PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />{blogBlock}</div>;
  }

  if (page === "contact") {
    return (
      <div className="wix-page yazen-page-shell">
        <PageHead title={cfg.title} description={cfg.description || cfg.subtitle} path={path} />
        <section className="wix-contact-page-wrap">
          <div className="wix-home-overlay" />
          <div className="wix-contact-page-card">
            <div className="wix-home-contact-left">
              <h3>{cfg.title || "Contact"}</h3>
              <p>{cfg.description || "Reach out for collaboration, projects, or opportunities."}</p>
              {contactInfo.email ? <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p> : null}
              {contactInfo.phone ? <p><strong>Phone:</strong> <a href={`tel:${String(contactInfo.phone).replace(/\s+/g, "")}`}>{contactInfo.phone}</a></p> : null}
              {contactInfo.location ? <p>{contactInfo.location}</p> : null}
              <div className="mt-10 sm:mt-24 flex items-center gap-4">
                {social.githubUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.githubUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">GitHub</span>
                  </div>
                ) : null}
                {social.linkedinUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.linkedinUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">LinkedIn</span>
                  </div>
                ) : null}
                {social.facebookUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.facebookUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="Facebook">
                      <Facebook size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">Facebook</span>
                  </div>
                ) : null}
                {social.instagramUrl ? (
                  <div className="yazen-social-tooltip">
                    <a href={social.instagramUrl} target="_blank" rel="noreferrer" className="yazen-social-icon" aria-label="Instagram">
                      <Instagram size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">Instagram</span>
                  </div>
                ) : null}
              </div>
            </div>
            <form className="wix-home-contact-form" onSubmit={submitContact}>
              <div><label>First name *</label><input value={contactForm.firstName} onChange={(e) => setContactForm((prev) => ({ ...prev, firstName: e.target.value }))} /></div>
              <div><label>Last name *</label><input value={contactForm.lastName} onChange={(e) => setContactForm((prev) => ({ ...prev, lastName: e.target.value }))} /></div>
              <div className="full"><label>Email *</label><input type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} /></div>
              <div className="full"><label>Subject</label><input value={contactForm.subject} onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))} /></div>
              <div className="full"><label>Message *</label><textarea value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} /></div>
              <button className="full" type="submit" disabled={sendMessageM.isPending}>{sendMessageM.isPending ? "Sending..." : "Send"}</button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  if (page === "certifications" && slug) {
    const cert = certificationItems.find((x, i) => certificationSlug(x, i) === slug);
    if (!cert) {
      return <div className="wix-page yazen-page-shell"><PageHead title="Certification Not Found" description="Certification not found." path={path} /><section className="wix-section"><div className="wix-empty">This certification does not exist.</div><Link className="wix-link" to="/certifications">Back to Certifications</Link></section></div>;
    }
    return (
      <div className="wix-page yazen-page-shell">
        <PageHead title={cert.title || "Certification"} description={cert.description || ""} path={path} />
        <section className="wix-section yazen-section-body">
          <div className="mb-3 flex justify-end">
            <Link className="yazen-primary-btn !px-3 !py-1.5 !text-xs" to="/certifications">Close</Link>
          </div>
          {cert.certificateUrl ? <img src={cert.certificateUrl} alt={cert.title || "certification"} className="wix-project-detail-image" loading="lazy" decoding="async" data-rawsrc={cert.certificateUrl} data-try-index="0" onError={setNextImageFallback} /> : null}
          <p style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>{cert.description || "No description provided."}</p>
          <Link className="wix-link" to="/certifications">Back to Certifications</Link>
        </section>
      </div>
    );
  }

  if (page === "certifications") {
    return <div className="yazen-page-shell"><PageHead title="Certifications" description="Certifications" path={path} />{certificationsBlock}</div>;
  }

  return null;
}
