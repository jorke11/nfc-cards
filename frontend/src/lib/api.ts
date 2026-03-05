import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from NextAuth session
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as any)?.message || 'An error occurred';
      console.error('API Error:', message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

// API client methods
export const apiClient = {
  // Auth endpoints
  auth: {
    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
    logout: () =>
      api.post('/auth/logout'),
    verifyEmail: (token: string) =>
      api.post('/auth/verify-email', { token }),
    requestPasswordReset: (email: string) =>
      api.post('/auth/request-password-reset', { email }),
    resetPassword: (token: string, newPassword: string) =>
      api.post('/auth/reset-password', { token, newPassword }),
    requestMagicLink: (email: string) =>
      api.post('/auth/magic-link', { email }),
  },

  // User endpoints
  users: {
    getCurrentUser: () =>
      api.get('/users/me'),
    updateUser: (data: any) =>
      api.patch('/users/me', data),
    deleteAccount: () =>
      api.delete('/users/me'),
  },

  // Profile endpoints
  profiles: {
    getMyProfile: () =>
      api.get('/profiles/me'),
    getProfileByUsername: (username: string) =>
      api.get(`/profiles/username/${username}`),
    getProfileById: (id: string) =>
      api.get(`/profiles/${id}`),
    createProfile: (data: any) =>
      api.post('/profiles', data),
    updateProfile: (data: any) =>
      api.patch('/profiles/me', data),
    deleteProfile: () =>
      api.delete('/profiles/me'),
    checkUsernameAvailability: (username: string) =>
      api.get(`/profiles/check-username/${username}`),
    toggleProfileStatus: (enabled: boolean) =>
      api.patch('/profiles/me/status', { enabled }),
  },

  // Storage endpoints
  storage: {
    getUploadUrl: (fileName: string, fileType: string) =>
      api.post('/storage/upload-url', { fileName, fileType }),
    deleteImage: (fileUrl: string) =>
      api.delete('/storage/image', { data: { fileUrl } }),
  },

  // Analytics endpoints
  analytics: {
    getProfileAnalytics: (dateRange?: { start: string; end: string }) =>
      api.get('/analytics/me', { params: dateRange }),
    trackView: (profileId: string, metadata?: any) =>
      api.post(`/analytics/track/${profileId}`, metadata),
  },

  // QR Code endpoint
  qrcode: {
    generateQRCode: (url: string) =>
      api.post('/qrcode/generate', { url }),
  },
};
