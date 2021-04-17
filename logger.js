const winston = require('winston')
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

let logger = null

function log() {
    if(logger === null) {
        logger = winston.createLogger({
            level: 'info',
            format: combine(
                label({ label: '' }),
                timestamp(),
                myFormat
            ),
            transports: [
              new winston.transports.File({ filename: 'api.log' })
            ]
        });
    }

    return logger
}

module.exports = log