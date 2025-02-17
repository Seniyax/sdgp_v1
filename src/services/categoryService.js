const Category = require('../models/category');
const { ERROR_MESSAGES } = require('../config/constants');
const logger = require('../utils/logger');

class CategoryService {
    // Get all categories
    static async getAllCategories() {
        try {
            return await Category.getAll();
        } catch (error) {
            logger.error('Error in getAllCategories service:', error);
            throw new Error(ERROR_MESSAGES.CATEGORY.FETCH_ERROR);
        }
    }

    // Get category by ID
    static async getCategoryById(id) {
        try {
            const category = await Category.getById(id);
            if (!category) {
                throw new Error(ERROR_MESSAGES.CATEGORY.NOT_FOUND);
            }
            return category;
        } catch (error) {
            logger.error(`Error in getCategoryById service for id ${id}:`, error);
            throw error;
        }
    }

    // Get active categories
    static async getActiveCategories() {
        try {
            return await Category.getActive();
        } catch (error) {
            logger.error('Error in getActiveCategories service:', error);
            throw new Error(ERROR_MESSAGES.CATEGORY.FETCH_ERROR);
        }
    }

    // Get businesses in category
    static async getBusinessesByCategory(categoryId, page = 1, limit = 10) {
        try {
            const category = await Category.getById(categoryId);
            if (!category) {
                throw new Error(ERROR_MESSAGES.CATEGORY.NOT_FOUND);
            }
            return await category.getBusinesses(page, limit);
        } catch (error) {
            logger.error(`Error in getBusinessesByCategory service for category ${categoryId}:`, error);
            throw error;
        }
    }

    // Get featured categories
    static async getFeaturedCategories() {
        try {
            return await Category.getFeatured();
        } catch (error) {
            logger.error('Error in getFeaturedCategories service:', error);
            throw new Error(ERROR_MESSAGES.CATEGORY.FETCH_ERROR);
        }
    }
}

module.exports = CategoryService;