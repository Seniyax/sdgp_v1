const { HTTP_STATUS } = require('../config/constants');

class ApiResponse {
    static success(res, { statusCode = HTTP_STATUS.OK, message = 'Success', data = null, pagination = null }) {
        const response = {
            success: true,
            message,
            data
        };

        if (pagination) {
            response.pagination = pagination;
        }

        return res.status(statusCode).json(response);
    }

    static error(res, { statusCode = HTTP_STATUS.INTERNAL_SERVER, message = 'Error occurred', errors = null }) {
        const response = {
            success: false,
            message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    static created(res, { message = 'Resource created successfully', data = null }) {
        return this.success(res, {
            statusCode: HTTP_STATUS.CREATED,
            message,
            data
        });
    }

    static notFound(res, { message = 'Resource not found' }) {
        return this.error(res, {
            statusCode: HTTP_STATUS.NOT_FOUND,
            message
        });
    }

    static badRequest(res, { message = 'Bad request', errors = null }) {
        return this.error(res, {
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message,
            errors
        });
    }

    static unauthorized(res, { message = 'Unauthorized access' }) {
        return this.error(res, {
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message
        });
    }

    static forbidden(res, { message = 'Forbidden access' }) {
        return this.error(res, {
            statusCode: HTTP_STATUS.FORBIDDEN,
            message
        });
    }

    static conflict(res, { message = 'Resource conflict', errors = null }) {
        return this.error(res, {
            statusCode: HTTP_STATUS.CONFLICT,
            message,
            errors
        });
    }
}

module.exports = ApiResponse;