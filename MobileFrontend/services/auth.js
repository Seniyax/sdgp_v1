import { api } from "./api";
import * as SecureStore from "expo-secure-store";
import { saveToken, saveUserData, clearAuthData } from "./storage";

// Sign up with email and password
export const signUp = async (email, username, password, name) => {
  try {
    const response = await api.post("/auth/signup", {
      email,
      username,
      password,
      name,
    });

    if (response.status === 201) {
      return { success: true };
    } else {
      throw new Error("Signup failed");
    }
  } catch (error) {
    console.error("Sign up error:", error);
    const errorMsg =
      error.response?.data?.error ||
      "Failed to create account. Please try again.";
    return { success: false, error: errorMsg };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const response = await api.post("/auth/signin", { email, password });

    const { user: userData, session } = response.data;
    const authToken = session?.access_token;

    if (authToken) {
      // Save auth token and user data in secure storage
      await saveToken(authToken);
      await saveUserData(userData);

      // Set default auth header for API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      return {
        success: true,
        user: userData,
        token: authToken,
      };
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.error("Sign in error:", error);
    const errorMsg =
      error.response?.data?.error || "Failed to sign in. Please try again.";
    return { success: false, error: errorMsg };
  }
};

// Social login (Google, Facebook, Apple)
export const socialLogin = async (provider, token) => {
  try {
    const response = await api.post(`/auth/social/${provider}`, {
      id_token: token,
    });

    const { user: userData, session } = response.data;
    const authToken = session?.access_token;

    if (authToken) {
      // Save auth token and user data in secure storage
      await saveToken(authToken);
      await saveUserData(userData);

      // Set default auth header for API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      return {
        success: true,
        user: userData,
        token: authToken,
      };
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.error(`${provider} login error:`, error);
    const errorMsg =
      error.response?.data?.error ||
      `${provider} login failed. Please try again.`;
    return { success: false, error: errorMsg };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await api.post("/auth/logout");

    // Clean up storage and API headers
    await clearAuthData();
    delete api.defaults.headers.common["Authorization"];

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    await api.post("/auth/reset-password", { email });
    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);

    // For security reasons, we always return success=true
    // This prevents user enumeration attacks
    return { success: true };
  }
};

// Check if user is authenticated
export const checkAuthStatus = async () => {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    const userData = await SecureStore.getItemAsync("userData");

    if (token && userData) {
      // Set default auth header for API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return {
        isAuthenticated: true,
        user: JSON.parse(userData),
        token,
      };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error("Auth status check error:", error);
    return { isAuthenticated: false, error: error.message };
  }
};
