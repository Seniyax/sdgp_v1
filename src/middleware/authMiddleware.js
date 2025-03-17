// src/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    // Use the correct customer ID
    req.user = {
      id: '86b0fb25-e1f7-41a1-8338-fee52ca2669d', // Correct ID from your database
      name: 'Uvindu Dev'
    };
    
    // In production, this would verify authentication tokens
    next();
  };
  
  module.exports = authMiddleware;