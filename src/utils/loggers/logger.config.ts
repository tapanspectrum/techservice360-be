import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs';

// Ensure logs directory exists
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export function createLogger() {
  return WinstonModule.createLogger({
    transports: [
      // Console logs
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, context }) => {
            return `[${timestamp}] ${level} [${context || 'App'}] ${message}`;
          }),
        ),
      }),

      // Log all activity
      new winston.transports.File({
        filename: 'logs/combined.log',
        level: 'info', // captures info, warn, error, etc.
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // Log errors only
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}
