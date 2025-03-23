import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Create context
export const ThemeContext = createContext();

// Theme options
export const themeOptions = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Actual theme modes
export const themeModes = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Provider component
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themePreference, setThemePreference] = useState(themeOptions.SYSTEM);
  const [activeTheme, setActiveTheme] = useState(themeModes.LIGHT);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('themePreference');
        if (savedTheme) {
          setThemePreference(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Update active theme when preference or system theme changes
  useEffect(() => {
    if (themePreference === themeOptions.SYSTEM) {
      setActiveTheme(systemTheme === 'dark' ? themeModes.DARK : themeModes.LIGHT);
    } else {
      setActiveTheme(themePreference === themeOptions.DARK ? themeModes.DARK : themeModes.LIGHT);
    }
  }, [themePreference, systemTheme]);

  // Set theme preference
  const setTheme = async (theme) => {
    setThemePreference(theme);
    try {
      await SecureStore.setItemAsync('themePreference', theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Base colors for light and dark modes
  const colors = {
    light: {
      primary: '#420F54',
      secondary: '#673E76',
      background: '#FFFFFF',
      card: '#F3E4FF',
      text: '#272D2F',
      textSecondary: '#420F54',
      border: '#E1E1E1',
      notification: '#FF3B30',
      placeholder: '#888888',
      error: '#FF3B30',
      success: '#34C759'
    },
    dark: {
      primary: '#9747FF',
      secondary: '#B985FF',
      background: '#121212',
      card: '#292639',
      text: '#FFFFFF',
      textSecondary: '#B985FF',
      border: '#3E3E3E',
      notification: '#FF453A',
      placeholder: '#AAAAAA',
      error: '#FF453A',
      success: '#30D158'
    }
  };

  // Current theme colors
  const theme = colors[activeTheme];

  // Check if current theme is dark
  const isDarkMode = activeTheme === themeModes.DARK;

  // Context value
  const themeContextValue = {
    theme,
    isDarkMode,
    themePreference,
    setTheme,
    themeOptions
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
