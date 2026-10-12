// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),

  getListings: (params?: any) => api.get('/listings', { params }),
  getListing: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: any) => api.post('/listings', data),
  updateListing: (id: string, data: any) => api.put(`/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),

  searchNearby: (params: any) => api.get('/search', { params }),
  getSuggestions: (params: any) => api.get('/search/suggestions', { params }),

  getFavorites: () => api.get('/favorites'),
  saveFavorite: (listingId: string) => api.post(`/favorites/${listingId}`),
  removeFavorite: (listingId: string) => api.delete(`/favorites/${listingId}`),
};

export default api;