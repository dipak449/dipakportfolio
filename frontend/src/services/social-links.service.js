import api from "./api";

export const SocialLinksAPI = {
  getPublic: () => api.get("/social-links/public").then((r) => r.data),
  getAdmin: () => api.get("/social-links/admin").then((r) => r.data),
  update: (payload) => api.put("/social-links/admin", payload).then((r) => r.data),
};

