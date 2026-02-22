const HomePage = require("../models/HomePage");
const { importImageToCloudinary } = require("../utils/image-storage.util");
const { normalizeImageFields } = require("../utils/image-url.util");

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
  let doc = await HomePage.findOne({ singletonKey: "main" });
  if (!doc) doc = await HomePage.create({ singletonKey: "main" });
  return doc;
}

function toResponse(doc) {
  return normalizeImageFields(
    {
      name: doc.name || "Dipak Sah",
      title: doc.title || "I AM FULL STACK DEVELOPER",
      subtitle: doc.subtitle || "A Creative Freelancer & Full Stack Developer",
      profileImageUrl: doc.profileImageUrl || "",
    },
    ["profileImageUrl"]
  );
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

    if (typeof req.body.name === "string") {
      doc.name = req.body.name.trim();
    }
    if (typeof req.body.title === "string") {
      doc.title = req.body.title.trim();
    }
    if (typeof req.body.subtitle === "string") {
      doc.subtitle = req.body.subtitle.trim();
    }
    if (typeof req.body.profileImageUrl === "string") {
      const image = safeUrl(req.body.profileImageUrl);
      doc.profileImageUrl = image
        ? await importImageToCloudinary(image, "dipak_portfolio/home")
        : "";
    }

    await doc.save();
    res.json(toResponse(doc));
  } catch (e) {
    next(e);
  }
};
