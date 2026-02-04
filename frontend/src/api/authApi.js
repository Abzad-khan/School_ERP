import api from './axios';

export const login = async (username, password) => {
  const { data } = await api.post('/api/auth/login', { username, password });
  return data;
};
