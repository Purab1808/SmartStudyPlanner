import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ssp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  requestRegisterOtp: (payload) => api.post('/auth/register/request-otp', payload),
  verifyRegisterOtp: (payload) => api.post('/auth/register/verify-otp', payload),
  requestPasswordResetOtp: (payload) => api.post('/auth/forgot-password/request-otp', payload),
  resetPassword: (payload) => api.post('/auth/forgot-password/reset', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  deleteAccount: () => api.delete('/auth/profile')
};

export const subjectsApi = {
  list: () => api.get('/subjects'),
  create: (payload) => api.post('/subjects', payload),
  update: (id, payload) => api.put(`/subjects/${id}`, payload),
  remove: (id) => api.delete(`/subjects/${id}`)
};

export const tasksApi = {
  list: (params = {}) => api.get('/tasks', { params }),
  create: (payload) => api.post('/tasks', payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
  remove: (id) => api.delete(`/tasks/${id}`),
  complete: (id) => api.patch(`/tasks/${id}/complete`)
};

export const mentalLoadApi = {
  list: (params = {}) => api.get('/mental-load', { params }),
  createOrUpdate: (payload) => api.post('/mental-load', payload),
  getByDate: (date) => api.get(`/mental-load/${date}`)
};

export const scheduleApi = {
  generate: (payload) => api.post('/schedule/generate', payload),
  list: (params = {}) => api.get('/schedule', { params }),
  getByDate: (date) => api.get(`/schedule/${date}`),
  clear: () => api.delete('/schedule'),
  overloadCheck: (params = {}) => api.get('/schedule/overload-check', { params })
};

export const analyticsApi = {
  studyTime: (params = {}) => api.get('/analytics/study-time', { params }),
  fatiguePattern: (params = {}) => api.get('/analytics/fatigue-pattern', { params }),
  productivityScore: (params = {}) => api.get('/analytics/productivity-score', { params })
};

export default api;
