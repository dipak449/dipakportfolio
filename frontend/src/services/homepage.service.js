import api from "./api";
import { toDisplayImageUrl } from "../utils/imageUrl";

function normalize(item) {
  if (!item) return item;
  return {
    ...item,
    profileImageUrl: toDisplayImageUrl(item.profileImageUrl),
  };
}

export const HomePageAPI = {
  getPublic: () => api.get("/homepage/public").then((r) => normalize(r.data)),
  getAdmin: () => api.get("/homepage/admin").then((r) => normalize(r.data)),
  update: (payload) => api.put("/homepage/admin", payload).then((r) => normalize(r.data)),
};

