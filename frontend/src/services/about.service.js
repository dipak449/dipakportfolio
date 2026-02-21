import api from "./api";
import { toDisplayImageUrl } from "../utils/imageUrl";

function normalize(item) {
  if (!item) return item;
  return {
    ...item,
    imageUrl: toDisplayImageUrl(item.imageUrl),
    resumeUrl: item.resumeUrl || "",
    facts: Array.isArray(item.facts) ? item.facts : [],
    certifications: Array.isArray(item.certifications)
      ? item.certifications.map((x) => ({
          ...x,
          certificateUrl: toDisplayImageUrl(x?.certificateUrl),
          isPublished: x?.isPublished !== false,
        }))
      : [],
  };
}

export const AboutAPI = {
  getPublic: () => api.get("/about/public").then((r) => normalize(r.data)),
  getAdmin: () => api.get("/about/admin").then((r) => normalize(r.data)),
  update: (payload) => api.put("/about/admin", payload).then((r) => normalize(r.data)),
};
