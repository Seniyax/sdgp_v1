// Environment configs
const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

// Supabase table names
const TABLES = {
    CATEGORY: 'category',          // Changed to match your schema
    BUSINESS: 'business'           // Changed to match your schema
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
    }
};

// Success messages
const SUCCESS_MESSAGES = {
    CATEGORY: {
        FETCHED: 'Categories fetched successfully'
    },
    BUSINESS: {
        FETCHED: 'Businesses fetched successfully'
    }
};

module.exports = {
    ENV,
    TABLES,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};