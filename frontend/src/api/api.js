import api from './axios';

export const classApi = {
  getAll: () => api.get('/api/classes'),
  getById: (id) => api.get(`/api/classes/${id}`),
  create: (body) => api.post('/api/classes', body),
  update: (id, body) => api.put(`/api/classes/${id}`, body),
  delete: (id) => api.delete(`/api/classes/${id}`),
};

export const studentApi = {
  getAll: () => api.get('/api/students'),
  getByClass: (className) => api.get(`/api/students/class/${className}`),
  getMe: () => api.get('/api/students/me'),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (body) => api.post('/api/students', body),
  update: (id, body) => api.put(`/api/students/${id}`, body),
  delete: (id) => api.delete(`/api/students/${id}`),
};

export const employeeApi = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (body) => api.post('/api/employees', body),
  update: (id, body) => api.put(`/api/employees/${id}`, body),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

export const attendanceApi = {
  save: (body) => api.post('/api/attendance', body),
  getByClass: (className) => api.get(`/api/attendance/class/${className}`),
  getByDate: (date) => api.get(`/api/attendance/date/${date}`),
  getByClassAndDate: (className, date) => api.get(`/api/attendance/class/${className}/date/${date}`),
  getMe: () => api.get('/api/attendance/me'),
};

export const assignmentApi = {
  getByClass: (className) => api.get(`/api/assignments/class/${className}`),
  getById: (id) => api.get(`/api/assignments/${id}`),
  create: (formData) => api.post('/api/assignments', formData),
  update: (id, formData) => api.put(`/api/assignments/${id}`, formData),
  delete: (id) => api.delete(`/api/assignments/${id}`),
  getSubmissions: (assignmentId) => api.get(`/api/assignments/${assignmentId}/submissions`),
  getMySubmission: (assignmentId) => api.get(`/api/assignments/${assignmentId}/submissions/me`),
  submit: (assignmentId, formData) => api.post(`/api/assignments/${assignmentId}/submit`, formData),
};

export const announcementApi = {
  getByClass: (className) => api.get(`/api/announcements/class/${className}`),
  getById: (id) => api.get(`/api/announcements/${id}`),
  create: (body) => api.post('/api/announcements', body),
  update: (id, body) => api.put(`/api/announcements/${id}`, body),
  delete: (id) => api.delete(`/api/announcements/${id}`),
};

export const feeApi = {
  getAll: () => api.get('/api/fees'),
  getMe: () => api.get('/api/fees/me'),
  getById: (id) => api.get(`/api/fees/${id}`),
  create: (body) => api.post('/api/fees', body),
  update: (id, body) => api.put(`/api/fees/${id}`, body),
  delete: (id) => api.delete(`/api/fees/${id}`),
};

export const certificateApi = {
  getAll: () => api.get('/api/certificates'),
  getMe: () => api.get('/api/certificates/me'),
  create: (body) => api.post('/api/certificates', body),
  delete: (id) => api.delete(`/api/certificates/${id}`),
  download: (id) =>
    api.get(`/api/certificates/${id}/download`, {
      responseType: 'blob',
    }),
};


export const gamificationApi = {
  getByClass: (className) => api.get(`/api/gamification/class/${className}`),
  getStats: (className) => api.get(`/api/gamification/class/${className}/stats`),
  getById: (id) => api.get(`/api/gamification/${id}`),
  create: (body) => api.post('/api/gamification', body),
  update: (id, body) => api.put(`/api/gamification/${id}`, body),
  delete: (id) => api.delete(`/api/gamification/${id}`),
};

export const badgeApi = {
  getAll: () => api.get('/api/badges'),
  create: (body) => api.post('/api/badges', body),
  update: (id, body) => api.put(`/api/badges/${id}`, body),
  delete: (id) => api.delete(`/api/badges/${id}`),
};

export const chatApi = {
  getConversations: () => api.get('/api/chat/conversations'),
  getWith: (userId) => api.get(`/api/chat/with/${userId}`),
  send: (body) => api.post('/api/chat', body),
};

export const userApi = {
  getAll: () => api.get('/api/users'),
};

export const dashboardApi = {
  getStats: () => api.get('/api/dashboard/stats'),
  getStudentStats: () => api.get('/api/dashboard/stats/student'),
};
