import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify')
};

// Projects
export const projectsAPI = {
  getAll: (params?: { category?: string; featured?: boolean }) => api.get('/projects', { params }),
  getBySlug: (slug: string) => api.get(`/projects/${slug}`),
  create: (data: object) => api.post('/projects', data),
  update: (id: string, data: object) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`)
};

// Services
export const servicesAPI = {
  getAll: () => api.get('/services'),
  create: (data: object) => api.post('/services', data),
  update: (id: string, data: object) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`)
};

// Project Requests
export const requestsAPI = {
  submit: (data: object) => api.post('/requests', data),
  track: (requestId: string, email: string) => api.get('/requests/track', { params: { requestId, email } }),
  getDashboard: (requestId: string, email: string) => api.get(`/requests/${requestId}/dashboard`, { params: { email } }),
  sendMessage: (requestId: string, data: object) => api.post(`/requests/${requestId}/message`, data),
  // Admin
  getAll: (params?: object) => api.get('/requests', { params }),
  getById: (id: string) => api.get(`/requests/${id}`),
  updateStatus: (id: string, status: string, note?: string) => api.patch(`/requests/${id}/status`, { status, note }),
  adminMessage: (id: string, message: string) => api.post(`/requests/${id}/admin-message`, { message }),
  updateQuotation: (id: string, data: object) => api.patch(`/requests/${id}/quotation`, data)
};

// Contact
export const contactAPI = {
  send: (data: object) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`)
};

// Testimonials
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  create: (data: object) => api.post('/testimonials', data),
  update: (id: string, data: object) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`)
};

// Blog
export const blogAPI = {
  getAll: (params?: { category?: string }) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  create: (data: object) => api.post('/blog', data),
  update: (id: string, data: object) => api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`)
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRecentActivity: () => api.get('/admin/recent-activity')
};

export default api;
