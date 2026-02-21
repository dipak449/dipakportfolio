function extractGoogleDriveFileId(url = "") {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = String(url).match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

export function normalizeImageUrl(rawUrl = "") {
  const value = String(rawUrl || "")
    .trim()
    .replace(/^[<"\s]+|[>"\s]+$/g, "")
    .replace(/[;,]+$/g, "");
  if (!value) return "";
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  // Keep local paths untouched except URI-safe encoding for spaces.
  if (value.startsWith("/")) return encodeURI(value);

  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes("drive.google.com") || hostname.includes("docs.google.com") || hostname.includes("googleusercontent.com")) {
      const fileId = extractGoogleDriveFileId(value);
      if (fileId) {
        const resourceKey = parsed.searchParams.get("resourcekey");
        const resourceKeyPart = resourceKey ? `&resourcekey=${encodeURIComponent(resourceKey)}` : "";
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000${resourceKeyPart}`;
      }
    }

    if (hostname.includes("dropbox.com")) {
      let x = value.replace("www.dropbox.com", "dl.dropboxusercontent.com");
      if (x.includes("?")) {
        x = x.replace(/([?&])dl=0/, "$1raw=1").replace(/([?&])dl=1/, "$1raw=1");
      } else {
        x += "?raw=1";
      }
      return encodeURI(x);
    }

    return encodeURI(value);
  } catch {
    return encodeURI(value);
  }
}

export function toDisplayImageUrl(rawUrl = "") {
  const normalized = normalizeImageUrl(rawUrl);
  if (!normalized) return "";
  if (normalized.startsWith("data:") || normalized.startsWith("blob:") || normalized.startsWith("/")) return normalized;
  return normalized;
}

export function getImageFallbackCandidates(rawUrl = "") {
  const value = String(rawUrl || "").trim();
  if (!value) return [];
  const normalized = normalizeImageUrl(value);
  const fileId = extractGoogleDriveFileId(value);
  if (!fileId) return normalized ? [normalized] : [];

  let resourceKey = "";
  try {
    const parsed = new URL(value);
    resourceKey = parsed.searchParams.get("resourcekey") || "";
  } catch {
    resourceKey = "";
  }
  const resourceKeyPart = resourceKey ? `&resourcekey=${encodeURIComponent(resourceKey)}` : "";

  const candidates = [
    normalized,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000${resourceKeyPart}`,
    `https://drive.google.com/uc?export=view&id=${fileId}${resourceKeyPart}`,
    `https://drive.google.com/uc?export=download&id=${fileId}${resourceKeyPart}`,
  ].filter(Boolean);

  return [...new Set(candidates)];
}
