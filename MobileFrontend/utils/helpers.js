import { Platform, Dimensions, PixelRatio } from 'react-native';
import { format, addMinutes, parseISO } from 'date-fns';

const { width, height } = Dimensions.get('window');

// Responsive font scaling
export const fontScale = PixelRatio.getFontScale();
export const normalize = (size) => {
  const newSize = size * fontScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatStr = 'MMMM d, yyyy') => {
  if (!date) return '';
  
  // If date is a string, parse it first
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Format time
export const formatTime = (date, formatStr = 'h:mm a') => {
  if (!date) return '';
  
  // If date is a string, parse it first
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Combine date and time strings
export const combineDateAndTime = (dateStr, timeStr) => {
  // Parse date string
  const date = parseISO(dateStr);
  
  // Extract hours and minutes from time string (e.g., "6:30 PM")
  const timeRegex = /(\d+):(\d+)\s*([AP]M)/i;
  const match = timeStr.match(timeRegex);
  
  if (!match) return date;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Set the time components on the date object
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0
  );
};

// Generate time slots based on opening and closing times
export const generateTimeSlots = (openingTime, closingTime, intervalMinutes = 30) => {
  const timeSlots = [];
  
  // Parse opening and closing times
  const openingRegex = /(\d+):(\d+)\s*([AP]M)/i;
  const closingRegex = /(\d+):(\d+)\s*([AP]M)/i;
  
  const openingMatch = openingTime.match(openingRegex);
  const closingMatch = closingTime.match(closingRegex);
  
  if (!openingMatch || !closingMatch) return timeSlots;
  
  // Create a base date to work with (today's date)
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  
  // Set opening time
  let openHours = parseInt(openingMatch[1], 10);
  const openMinutes = parseInt(openingMatch[2], 10);
  const openAmPm = openingMatch[3].toUpperCase();
  
  if (openAmPm === 'PM' && openHours < 12) {
    openHours += 12;
  } else if (openAmPm === 'AM' && openHours === 12) {
    openHours = 0;
  }
  
  // Set closing time
  let closeHours = parseInt(closingMatch[1], 10);
  const closeMinutes = parseInt(closingMatch[2], 10);
  const closeAmPm = closingMatch[3].toUpperCase();
  
  if (closeAmPm === 'PM' && closeHours < 12) {
    closeHours += 12;
  } else if (closeAmPm === 'AM' && closeHours === 12) {
    closeHours = 0;
  }
  
  // Create Date objects for opening and closing times
  const openingDateTime = new Date(baseDate);
  openingDateTime.setHours(openHours, openMinutes, 0, 0);
  
  const closingDateTime = new Date(baseDate);
  closingDateTime.setHours(closeHours, closeMinutes, 0, 0);
  
  // If closing time is on the next day
  if (closingDateTime <= openingDateTime) {
    closingDateTime.setDate(closingDateTime.getDate() + 1);
  }
  
  // Generate time slots
  let currentTime = new Date(openingDateTime);
  while (currentTime < closingDateTime) {
    timeSlots.push(format(currentTime, 'h:mm a'));
    currentTime = addMinutes(currentTime, intervalMinutes);
  }
  
  return timeSlots;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Generate a random string (useful for temporary IDs, etc.)
export const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Check if the device is an iPhone with a notch
export const hasNotch = () => {
  const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');
  
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (screenHeight === 812 || screenWidth === 812 || screenHeight === 896 || screenWidth === 896)
  );
};

// Get safe area insets for devices with notches
export const getSafeAreaInsets = () => {
  if (hasNotch()) {
    return {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0
    };
  }
  
  return {
    top: Platform.OS === 'ios' ? 20 : 0,
    bottom: 0,
    left: 0,
    right: 0
  };
};

// Check if the app is running on a real device (not simulator/emulator)
export const isRealDevice = () => {
  if (Platform.OS === 'web') return false;
  
  return !global.__DEV__ || Platform.constants.Brand !== 'Apple';
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Deep merge two objects
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Helper for deepMerge
const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

// Debounce function to limit how often a function is called
export const debounce = (func, delay = 300) => {
  let timeoutId;
  
  return function(...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

// Throttle function to ensure a function is called at most once in a specified time period
export const throttle = (func, limit = 300) => {
  let lastCall = 0;
  
  return function(...args) {
    const now = new Date().getTime();
    
    if (now - lastCall < limit) return;
    
    lastCall = now;
    return func(...args);
  };
};
