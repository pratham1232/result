import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('bgi_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bgi_admin_token');
      localStorage.removeItem('bgi_admin_user');
    }
    return Promise.reject(err);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// Results APIs
export const resultsAPI = {
  getAll: (params) => api.get('/results', { params }),
  getById: (teamId) => api.get(`/results/${teamId}`),
  getStats: () => api.get('/results/stats'),
  update: (id, data) => api.put(`/results/${id}`, data),
  delete: (id) => api.delete(`/results/${id}`),
  clearAll: () => api.delete('/results'),
};

// Upload API
export const uploadAPI = {
  uploadExcel: (formData, passcode) => api.post('/upload/results', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      'x-access-key': passcode
    }
  }),
};

export default api;
