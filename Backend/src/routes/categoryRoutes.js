const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    getBusinessesByCategory,
    getFeaturedCategories
} = require('../controllers/categoryController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(getAllCategories));
router.get('/featured', asyncHandler(getFeaturedCategories));
router.get('/:id', asyncHandler(getCategoryById));
router.get('/:id/businesses', asyncHandler(getBusinessesByCategory));

module.exports = router;