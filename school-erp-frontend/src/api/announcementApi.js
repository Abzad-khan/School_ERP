import api from "./axios";

export const getAnnouncements = () => api.get("/announcements");
export const addAnnouncement = (data) => api.post("/announcements", data);
export const updateAnnouncement = (id, data) =>
  api.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) =>
  api.delete(`/announcements/${id}`);
