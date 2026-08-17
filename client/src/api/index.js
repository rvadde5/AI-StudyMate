import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getDashboard: () => api.get('/auth/dashboard'),
  getAllUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  updateUserRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
};

export const documentAPI = {
  getAll: () => api.get('/documents'),
  getOne: (id) => api.get(`/documents/${id}`),
  createNote: (data) => api.post('/documents/note', data),
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  summarize: (id) => api.post(`/documents/${id}/summarize`),
  delete: (id) => api.delete(`/documents/${id}`),
  getRecommendations: () => api.get('/documents/recommendations'),
};

export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getOne: (id) => api.get(`/quizzes/${id}`),
  generate: (data) => api.post('/quizzes/generate', data),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  delete: (id) => api.delete(`/quizzes/${id}`),
};

export const chatAPI = {
  getHistory: (sessionId) => api.get('/chat', { params: { sessionId } }),
  send: (data) => api.post('/chat', data),
  clear: (sessionId) => api.delete('/chat', { params: { sessionId } }),
};

export const flashcardAPI = {
  getAll: () => api.get('/flashcards'),
  generate: (data) => api.post('/flashcards/generate', data),
  toggleMastered: (id) => api.patch(`/flashcards/${id}/master`),
  delete: (id) => api.delete(`/flashcards/${id}`),
};
