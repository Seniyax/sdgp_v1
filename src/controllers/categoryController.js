const supabaseClient = require('../config/supabaseClient');
const { TABLES, HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');
const logger = require('../utils/logger');


const getAllCategories = async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from(TABLES.CATEGORY)
            .select('*')
            .order('id');

        if (error) {
            logger.error('Error fetching categories:', error);
            throw error;
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.CATEGORY.FETCHED,
            data
        });
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            success: false,
            message: ERROR_MESSAGES.CATEGORY.FETCH_ERROR,
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseClient
            .from(TABLES.CATEGORY)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching category ${id}:`, error);
            throw error;
        }

        if (!data) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ERROR_MESSAGES.CATEGORY.NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data
        });
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            success: false,
            message: error.message
        });
    }
};

const getBusinessesByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await supabaseClient
            .from(TABLES.BUSINESS)
            .select('*', { count: 'exact' })
            .eq('category_id', id)
            .range(from, to);

        if (error) {
            logger.error(`Error fetching businesses for category ${id}:`, error);
            throw error;
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getBusinessesByCategory
};