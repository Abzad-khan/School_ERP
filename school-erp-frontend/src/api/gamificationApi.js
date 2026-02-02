import api from "./api";

export const getGamifications = () => api.get("/gamification");

export const createGamification = (data) =>
  api.post("/gamification", data);

export const updateGamification = (id, data) =>
  api.put(`/gamification/${id}`, data);

export const deleteGamification = (id) =>
  api.delete(`/gamification/${id}`);
