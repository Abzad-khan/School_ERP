import api from "./api";

export const getMessages = () => api.get("/chats");

export const createMessage = (data) =>
  api.post("/chats", data);

export const updateMessage = (id, data) =>
  api.put(`/chats/${id}`, data);

export const deleteMessage = (id) =>
  api.delete(`/chats/${id}`);
