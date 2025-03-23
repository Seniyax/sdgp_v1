import * as SecureStore from 'expo-secure-store';

// Keys for stored data
const KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  THEME_PREFERENCE: 'themePreference',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  RESERVATION_DRAFTS: 'reservationDrafts'
};

// Save auth token securely
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(KEYS.USER_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

// Get stored auth token
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Delete auth token
export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(KEYS.USER_TOKEN);
    return true;
  } catch (error) {
    console.error('Error deleting token:', error);
    return false;
  }
};

// Save user data
export const saveUserData = async (userData) => {
  try {
    const userDataString = JSON.stringify(userData);
    await SecureStore.setItemAsync(KEYS.USER_DATA, userDataString);
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync(KEYS.USER_DATA);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Delete user data
export const deleteUserData = async () => {
  try {
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
};

// Clear all auth-related data (for logout)
export const clearAuthData = async () => {
  try {
    await deleteToken();
    await deleteUserData();
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

// Save theme preference
export const saveThemePreference = async (preference) => {
  try {
    await SecureStore.setItemAsync(KEYS.THEME_PREFERENCE, preference);
    return true;
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return false;
  }
};

// Get theme preference
export const getThemePreference = async () => {
  try {
    return await SecureStore.getItemAsync(KEYS.THEME_PREFERENCE);
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return null;
  }
};

// Save notification preferences
export const saveNotificationPreference = async (enabled) => {
  try {
    await SecureStore.setItemAsync(
      KEYS.NOTIFICATIONS_ENABLED, 
      enabled ? 'true' : 'false'
    );
    return true;
  } catch (error) {
    console.error('Error saving notification preference:', error);
    return false;
  }
};

// Get notification preferences
export const getNotificationPreference = async () => {
  try {
    const value = await SecureStore.getItemAsync(KEYS.NOTIFICATIONS_ENABLED);
    return value === 'true';
  } catch (error) {
    console.error('Error getting notification preference:', error);
    return true; // Default to enabled
  }
};

// Save reservation draft
export const saveReservationDraft = async (draft) => {
  try {
    const drafts = await getReservationDrafts() || [];
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push({
        ...draft,
        id: draft.id || Date.now().toString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    await SecureStore.setItemAsync(KEYS.RESERVATION_DRAFTS, JSON.stringify(drafts));
    return true;
  } catch (error) {
    console.error('Error saving reservation draft:', error);
    return false;
  }
};

// Get all reservation drafts
export const getReservationDrafts = async () => {
  try {
    const drafts = await SecureStore.getItemAsync(KEYS.RESERVATION_DRAFTS);
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error getting reservation drafts:', error);
    return [];
  }
};

// Delete a reservation draft
export const deleteReservationDraft = async (draftId) => {
  try {
    const drafts = await getReservationDrafts();
    const filteredDrafts = drafts.filter(draft => draft.id !== draftId);
    await SecureStore.setItemAsync(KEYS.RESERVATION_DRAFTS, JSON.stringify(filteredDrafts));
    return true;
  } catch (error) {
    console.error('Error deleting reservation draft:', error);
    return false;
  }
};
