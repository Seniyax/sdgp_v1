const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    getBusinessesByCategory,
    getFeaturedCategories
} = require('../controllers/categoryController');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/categories - Get all categories
router.get('/', asyncHandler(getAllCategories));

// GET /api/categories/featured - Get featured categories
router.get('/featured', asyncHandler(getFeaturedCategories));

// GET /api/categories/:id - Get category by ID
router.get('/:id', asyncHandler(getCategoryById));

// GET /api/categories/:id/businesses - Get businesses in category
router.get('/:id/businesses', asyncHandler(getBusinessesByCategory));

module.exports = router;