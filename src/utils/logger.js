const winston = require('winston');
const { format } = winston;


const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
);
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.printf(({ level, message, timestamp, ...meta }) => {
                    return `${timestamp} ${level}: ${message} ${
                        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                    }`; 
                })
            )
        }),

        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, 
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5
        })
    ]
});

logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;
