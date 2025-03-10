const winston = require('winston');
const { format } = winston;

// Define log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
);

// Configure logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.printf(({ level, message, timestamp, ...meta }) => {
                    return `${timestamp} ${level}: ${message} ${
                        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                    }`; // Use backticks for template literals
                })
            )
        }),

        // Error log file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        // Combined log file
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// Stream for Morgan integration
logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;
