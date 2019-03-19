import winston from 'winston';
import expressWinston from 'express-winston';
import moment from 'moment';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(info => {
      return `[${info.level}] ${info.message} ${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss')}`;
      // ${JSON.stringify(info.meta, null, 2)}
    })
  ),
});

export const expressWinstonLogger = expressWinston.logger({
  expressFormat: true,
  colorize: true,
  meta: true,
  winstonInstance: logger,
});

export const expressWinstonErrorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default logger;
