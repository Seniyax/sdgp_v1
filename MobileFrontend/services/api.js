import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from "@env";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from secure store:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token (you would need to implement this on backend)
        // For now, we'll just redirect to login
        const router = require('expo-router').router;
        
        // Clear stored auth data
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        
        // Redirect to login
        router.replace('/auth/signin');
        
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signIn: (email, password) => api.post('/auth/signin', { email, password }),
  signUp: (userData) => api.post('/auth/signup', userData),
  socialLogin: (provider, token) => api.post(`/auth/social/${provider}`, { id_token: token }),
  logout: () => api.post('/auth/logout')
};

// Profile endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updateAvatar: (formData) => api.put('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Reservation endpoints
export const reservationAPI = {
  getReservations: () => api.get('/reservations'),
  getReservation: (id) => api.get(`/reservations/${id}`),
  createReservation: (data) => api.post('/reservations', data),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  cancelReservation: (id) => api.delete(`/reservations/${id}`)
};

// Restaurant endpoints
export const restaurantAPI = {
  getRestaurants: () => api.get('/restaurants'),
  getRestaurant: (id) => api.get(`/restaurants/${id}`),
  getTables: (restaurantId) => api.get(`/restaurants/${restaurantId}/tables`)
};
