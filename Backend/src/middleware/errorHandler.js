const ApiResponse = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    return ApiResponse.error(res, {
        message: 'Something went wrong!',
        errors: err.message
    });
};

module.exports = errorHandler;