import api from "./axios";

export const getAttendance = () => api.get("/attendance");
export const addAttendance = (data) => api.post("/attendance", data);
export const updateAttendance = (id, data) =>
  api.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) =>
  api.delete(`/attendance/${id}`);
