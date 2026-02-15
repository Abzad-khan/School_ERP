import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle JWT verification failure (401) or invalid token (403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      
      // prompt user to login again

      error.response?.status === 401 ? 
      alert('Please log in using valid credentials .') : 
      alert('Your session has expired. Please log in again.');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
