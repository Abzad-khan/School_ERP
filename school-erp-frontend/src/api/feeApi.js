import api from "./api";

export const getFees = () => api.get("/fees");

export const createFee = (data) =>
  api.post("/fees", data);

export const updateFee = (id, data) =>
  api.put(`/fees/${id}`, data);

export const deleteFee = (id) =>
  api.delete(`/fees/${id}`);
