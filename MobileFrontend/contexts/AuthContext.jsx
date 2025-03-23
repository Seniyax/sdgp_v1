import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";
import { api } from "../services/api";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);

  // Check for stored authentication on app load
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        const storedUser = await SecureStore.getItemAsync("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Failed to load auth from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Sign in with email/password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/signin", { email, password });

      const { user: userData, session } = response.data;
      const authToken = session?.access_token;

      if (authToken) {
        await SecureStore.setItemAsync("userToken", authToken);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));

        setUser(userData);
        setToken(authToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        return { success: true };
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMsg =
        error.response?.data?.error || "Failed to sign in. Please try again.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password
  const signUp = async (email, username, password, name) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        email,
        username,
        password,
        name,
      });

      // Handle successful signup
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
    } finally {
      setLoading(false);
    }
  };

  // Social login (Google, Facebook, Apple)
  const socialLogin = async (provider, token) => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/social/${provider}`, {
        id_token: token,
      });

      const { user: userData, session } = response.data;
      const authToken = session?.access_token;

      if (authToken) {
        await SecureStore.setItemAsync("userToken", authToken);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));

        setUser(userData);
        setToken(authToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        return { success: true };
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      const errorMsg =
        error.response?.data?.error ||
        `${provider} login failed. Please try again.`;
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");

      // Clean up storage
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");

      // Reset state
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common["Authorization"];

      // Navigate to auth screen
      router.replace("/auth/signin");

      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out properly. Please try again.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put("/profile", profileData);

      if (response.data.user) {
        const updatedUser = response.data.user;
        await SecureStore.setItemAsync("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }

      return { success: false, error: "Failed to update profile" };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update profile",
      };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  // Value object with state and functions
  const authContextValue = {
    user,
    business,
    loading,
    signIn,
    signUp,
    signOut,
    socialLogin,
    updateProfile,
    isAuthenticated,
    setBusiness,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
