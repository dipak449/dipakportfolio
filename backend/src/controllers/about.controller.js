const AboutSection = require("../models/AboutSection");
const { importImageToCloudinary } = require("../utils/image-storage.util");
const { normalizeImageFields, normalizeImageUrl } = require("../utils/image-url.util");
const axios = require("axios");
const path = require("path");

function safeUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!/^https?:\/\//i.test(raw)) return "";
  try {
    return new URL(raw).toString();
  } catch {
    return "";
  }
}

async function getOrCreate() {
  let doc = await AboutSection.findOne({ singletonKey: "main" });
  if (!doc) doc = await AboutSection.create({ singletonKey: "main" });
  return doc;
}

function toResponse(doc) {
  const base = normalizeImageFields(
    {
      imageUrl: doc.imageUrl || "",
      description: doc.description || "",
      resumeUrl: doc.resumeUrl || "",
      facts: Array.isArray(doc.facts) ? doc.facts : [],
      certifications: Array.isArray(doc.certifications) ? doc.certifications : [],
    },
    ["imageUrl"]
  );
  return {
    ...base,
    certifications: (base.certifications || []).map((item) => ({
      title: item?.title || "",
      certificateUrl: normalizeImageUrl(item?.certificateUrl || ""),
      description: item?.description || "",
      isPublished: item?.isPublished !== false,
    })),
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
    if (typeof req.body.description === "string") doc.description = req.body.description.trim();
    if (typeof req.body.imageUrl === "string") {
      const image = safeUrl(req.body.imageUrl);
      doc.imageUrl = image
        ? await importImageToCloudinary(image, "rabina_portfolio/about")
        : "";
    }
    if (typeof req.body.resumeUrl === "string") {
      doc.resumeUrl = safeUrl(req.body.resumeUrl);
    }
    if (Array.isArray(req.body.facts)) {
      doc.facts = req.body.facts
        .filter((x) => x && (String(x.label || "").trim() || String(x.value || "").trim()))
        .map((x) => ({
          label: String(x.label || "").trim(),
          value: String(x.value || "").trim(),
        }));
    }
    if (Array.isArray(req.body.certifications)) {
      doc.certifications = req.body.certifications
        .map((x) => ({
          title: String(x?.title || "").trim(),
          certificateUrl: safeUrl(x?.certificateUrl || ""),
          description: String(x?.description || "").trim(),
          isPublished: x?.isPublished !== false,
        }))
        .filter((x) => x.title || x.certificateUrl || x.description);
    }
    await doc.save();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};

function extractDriveFileId(url = "") {
  const value = String(url || "");
  const m1 = value.match(/\/file\/d\/([^/]+)/i);
  if (m1?.[1]) return m1[1];
  const m2 = value.match(/[?&]id=([^&]+)/i);
  if (m2?.[1]) return m2[1];
  return "";
}

function getDownloadSourceUrl(rawUrl = "") {
  const url = String(rawUrl || "").trim();
  if (!url) return "";
  if (/drive\.google\.com/i.test(url)) {
    const fileId = extractDriveFileId(url);
    if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

function isCloudinaryUrl(url = "") {
  return /:\/\/res\.cloudinary\.com\//i.test(String(url || ""));
}

function toCloudinaryAttachmentUrl(url = "") {
  const input = String(url || "");
  if (!isCloudinaryUrl(input)) return input;
  if (/\/upload\/fl_attachment\//i.test(input)) return input;
  return input.replace("/upload/", "/upload/fl_attachment/");
}

function safeFileNameFromUrl(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    const base = path.basename(u.pathname || "") || "resume";
    return base.includes(".") ? base : `${base}.pdf`;
  } catch {
    return "resume.pdf";
  }
}

exports.downloadResume = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    const source = getDownloadSourceUrl(doc.resumeUrl || "");
    if (!source) return res.status(404).json({ message: "Resume not found" });

    // Cloudinary raw files may reject server-side fetches; deliver as direct attachment URL.
    if (isCloudinaryUrl(source)) {
      return res.redirect(toCloudinaryAttachmentUrl(source));
    }

    const upstream = await axios.get(source, {
      responseType: "stream",
      maxRedirects: 5,
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        "User-Agent": "Rabina-Portfolio-Resume-Downloader",
      },
    });

    const contentType = upstream.headers["content-type"] || "application/octet-stream";
    const contentDisposition = upstream.headers["content-disposition"] || "";
    const matchName = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(contentDisposition);
    const rawName = matchName?.[1] ? decodeURIComponent(matchName[1].replace(/"/g, "")) : safeFileNameFromUrl(source);
    const fileName = rawName || "resume.pdf";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "no-store");
    upstream.data.pipe(res);
  } catch (e) {
    return res.status(502).json({ message: "Resume download failed. Please verify resume URL/file." });
  }
};
