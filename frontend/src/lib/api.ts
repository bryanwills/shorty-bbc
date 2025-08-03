import axios from 'axios';
import { CreateUrlRequest, CreateUrlResponse, UrlListResponse, UrlResponse, DeleteUrlResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const urlApi = {
  // Create a new shortened URL
  create: async (data: CreateUrlRequest): Promise<CreateUrlResponse> => {
    const response = await api.post('/api/urls', data);
    return response.data;
  },

  // Get all URLs with pagination
  getAll: async (page: number = 1, limit: number = 50): Promise<UrlListResponse> => {
    const response = await api.get('/api/urls', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get URL by short code
  getByShortCode: async (shortCode: string): Promise<UrlResponse> => {
    const response = await api.get(`/api/urls/${shortCode}`);
    return response.data;
  },

  // Delete URL by short code
  delete: async (shortCode: string): Promise<DeleteUrlResponse> => {
    const response = await api.delete(`/api/urls/${shortCode}`);
    return response.data;
  },
};

export default api;