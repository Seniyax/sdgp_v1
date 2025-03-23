// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
  return usernameRegex.test(username);
};

// Password validation - minimum 8 characters, at least 1 letter and 1 number
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation - at least 2 characters, letters only
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

// Date validation - check if date is valid and not in the past
export const isValidFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date instanceof Date && !isNaN(date) && date > now;
};

// Form validation utility for sign up
export const validateSignupForm = (formData) => {
  const errors = {};
  
  if (!formData.name || !isValidName(formData.name)) {
    errors.name = 'Please enter a valid name';
  }

  if (!formData.username || !isValidUsername(formData.username)) {
    errors.username = 'Please enter a valid username (at least 3 alphanumeric characters)';
  }
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password || !isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with at least 1 letter and 1 number';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation utility for sign in
export const validateSigninForm = (formData) => {
  const errors = {};
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password) {
    errors.password = 'Please enter your password';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation utility for profile update
export const validateProfileForm = (formData) => {
  const errors = {};
  
  if (!formData.fullName || !isValidName(formData.fullName)) {
    errors.fullName = 'Please enter a valid name';
  }
  
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation utility for reservation
export const validateReservationForm = (formData) => {
  const errors = {};
  
  if (!formData.date || !isValidFutureDate(formData.date)) {
    errors.date = 'Please select a valid future date';
  }
  
  if (!formData.time) {
    errors.time = 'Please select a time';
  }
  
  if (!formData.guests || formData.guests < 1) {
    errors.guests = 'Please select at least 1 guest';
  }
  
  if (!formData.tableId) {
    errors.tableId = 'Please select a table';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
