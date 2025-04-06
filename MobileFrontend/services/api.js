import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@env";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from secure store:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already retried the request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/signin") &&
      !originalRequest.url.includes("/auth/signup") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        // Retrieve the stored refresh token
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userData");
          await SecureStore.deleteItemAsync("refreshToken");
          const router = require("expo-router").router;
          router.replace("/auth/signin");
          return Promise.reject(error);
        }

        // Request new tokens from the refresh endpoint
        const response = await api.post("/auth/refresh-token", {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken; // if provided

        // Save the new tokens in secure storage
        await SecureStore.setItemAsync("userToken", newAccessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        }

        // Update axios defaults and original request headers with the new token
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear stored auth data and redirect to login if refresh fails
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userData");
        await SecureStore.deleteItemAsync("refreshToken");
        const router = require("expo-router").router;
        router.replace("/auth/signin");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signIn: (email, password) => api.post("/auth/signin", { email, password }),
  signUp: (userData) => api.post("/auth/signup", userData),
  socialLogin: (provider, token) =>
    api.post(`/auth/social/${provider}`, { id_token: token }),
  logout: () => api.post("/auth/logout"),
};

// Profile endpoints
export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  updateAvatar: (formData) =>
    api.put("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Reservation endpoints
export const reservationAPI = {
  getReservations: () => api.get("/reservations"),
  getReservation: (id) => api.get(`/reservations/${id}`),
  createReservation: (data) => api.post("/reservations", data),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  cancelReservation: (id) => api.delete(`/reservations/${id}`),
};

// Restaurant endpoints
export const restaurantAPI = {
  getRestaurants: () => api.get("/restaurants"),
  getRestaurant: (id) => api.get(`/restaurants/${id}`),
  getTables: (restaurantId) => api.get(`/restaurants/${restaurantId}/tables`),
};
