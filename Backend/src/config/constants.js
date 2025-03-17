// Environment configs
const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
  };
  
  // Supabase table names
  const TABLES = {
    CATEGORY: 'category', // Changed to match your schema
    BUSINESS: 'business', // Changed to match your schema
    CUSTOMER_PAYMENT: 'customer_payment' // Added this based on your Payment model
  };
  
  // HTTP Status codes
  const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
  };
  
  // Error messages
  const ERROR_MESSAGES = {
    CATEGORY: {
      NOT_FOUND: 'Category not found',
      FETCH_ERROR: 'Error fetching categories',
      INVALID_ID: 'Invalid category ID'
    },
    BUSINESS: {
      NOT_FOUND: 'Business not found',
      FETCH_ERROR: 'Error fetching businesses'
    },
    PAYMENT: {
      NOT_FOUND: 'Payment not found',
      FETCH_ERROR: 'Error fetching payment details',
      INITIALIZATION_FAILED: 'Failed to initialize payment',
      INVALID_STATUS: 'Invalid payment status',
      PROCESSING_ERROR: 'Error processing payment'
    }
  };
  
  // Success messages
  const SUCCESS_MESSAGES = {
    CATEGORY: {
      FETCHED: 'Categories fetched successfully'
    },
    BUSINESS: {
      FETCHED: 'Businesses fetched successfully'
    },
    PAYMENT: {
      FETCHED: 'Payment details fetched successfully',
      INITIALIZED: 'Payment initialized successfully',
      PROCESSED: 'Payment processed successfully',
      STATUS_UPDATED: 'Payment status updated successfully'
    }
  };
  
  module.exports = {
    ENV,
    TABLES,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
  };