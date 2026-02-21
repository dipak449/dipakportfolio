import api from "./api";
import { toDisplayImageUrl } from "../utils/imageUrl";

function normalizeService(item) {
  if (!item) return item;
  return {
    ...item,
    imageUrl: toDisplayImageUrl(item.imageUrl),
  };
}

function normalizeServiceList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeService);
}

export const ServicesAPI = {
  list: () => api.get("/services").then((r) => normalizeServiceList(r.data)),
  adminAll: () => api.get("/services/admin/all").then((r) => normalizeServiceList(r.data)),
  create: (p) => api.post("/services", p).then((r) => r.data),
  update: (id, p) => api.put(`/services/${id}`, p).then((r) => r.data),
  remove: (id) => api.delete(`/services/${id}`).then((r) => r.data),
  toggleFeatured: (id) => api.patch(`/services/${id}/featured`).then((r) => normalizeService(r.data)),
};
