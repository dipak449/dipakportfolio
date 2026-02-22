const cloudinary = require("../config/cloudinary");
const { normalizeImageUrl, googleDriveCandidates } = require("./image-url.util");

function isCloudinaryUrl(value = "") {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return host === "res.cloudinary.com" || host.endsWith(".res.cloudinary.com");
  } catch {
    return false;
  }
}

function isRemoteHttpUrl(value = "") {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function importImageToCloudinary(rawUrl = "", folder = "dipak_portfolio/misc") {
  const normalized = normalizeImageUrl(rawUrl);
  if (!normalized) return "";
  if (normalized.startsWith("data:") || normalized.startsWith("blob:") || normalized.startsWith("/")) {
    return normalized;
  }
  if (!isRemoteHttpUrl(normalized) || isCloudinaryUrl(normalized)) return normalized;

  const tryUrls = [normalized, ...googleDriveCandidates(rawUrl)].filter(Boolean);
  for (const url of tryUrls) {
    try {
      const uploaded = await cloudinary.uploader.upload(url, {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
      if (uploaded?.secure_url) return uploaded.secure_url;
    } catch (err) {
      console.warn(`Cloudinary import attempt failed for ${folder}: ${err.message}`);
    }
  }
  return normalized;
}

module.exports = { importImageToCloudinary };
