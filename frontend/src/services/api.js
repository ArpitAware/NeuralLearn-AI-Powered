import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nl_token');
      localStorage.removeItem('nl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getOne: (slug) => api.get(`/courses/${slug}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  addReview: (id, data) => api.post(`/courses/${id}/reviews`, data),
};

export const progressAPI = {
  getAll: () => api.get('/progress'),
  getCourse: (courseId) => api.get(`/progress/${courseId}`),
  markComplete: (courseId, lessonId) => api.post(`/progress/${courseId}/lessons/${lessonId}/complete`),
  updateTime: (courseId, seconds) => api.post(`/progress/${courseId}/time`, { seconds }),
  addNote: (courseId, data) => api.post(`/progress/${courseId}/notes`, data),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getNotifications: () => api.get('/users/notifications'),
  markRead: (id) => api.put(`/users/notifications/${id}/read`),
  markAllRead: () => api.put('/users/notifications/read-all'),
  updateResume: (data) => api.put('/users/resume', data),
};

export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const communityAPI = {
  getPosts: (params) => api.get('/community', { params }),
  getPost: (id) => api.get(`/community/${id}`),
  create: (data) => api.post('/community', data),
  update: (id, data) => api.put(`/community/${id}`, data),
  delete: (id) => api.delete(`/community/${id}`),
  like: (id) => api.post(`/community/${id}/like`),
  comment: (id, data) => api.post(`/community/${id}/comments`, data),
};

export const analyticsAPI = {
  getAdmin: () => api.get('/analytics/admin'),
  getStudent: () => api.get('/analytics/student'),
};

export default api;
