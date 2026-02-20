const SocialLinks = require("../models/SocialLinks");

function safeUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!/^https?:\/\//i.test(raw)) return "";
  try {
    const u = new URL(raw);
    return u.toString();
  } catch {
    return "";
  }
}

async function getOrCreate() {
  let doc = await SocialLinks.findOne({ singletonKey: "main" });
  if (!doc) doc = await SocialLinks.create({ singletonKey: "main" });
  return doc;
}

function toResponse(doc) {
  return {
    githubUrl: doc.githubUrl || "",
    linkedinUrl: doc.linkedinUrl || "",
    facebookUrl: doc.facebookUrl || "",
    instagramUrl: doc.instagramUrl || "",
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
    if (typeof req.body.githubUrl === "string") doc.githubUrl = safeUrl(req.body.githubUrl);
    if (typeof req.body.linkedinUrl === "string") doc.linkedinUrl = safeUrl(req.body.linkedinUrl);
    if (typeof req.body.facebookUrl === "string") doc.facebookUrl = safeUrl(req.body.facebookUrl);
    if (typeof req.body.instagramUrl === "string") doc.instagramUrl = safeUrl(req.body.instagramUrl);
    await doc.save();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};
