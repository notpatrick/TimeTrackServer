import fs from 'fs';
import path from 'path';
import rfs from 'rotating-file-stream';
import winston from 'winston';
import expressWinston from 'express-winston';
import formatWinston from 'winston-console-formatter';
import config from '../config.json';

// log bodies
expressWinston.requestWhitelist.push('body');

// ensure log directory exists
const logDirectory = path.join(__dirname, '../', config.log.path);
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

// create rotating write stream
const errorLogStream = rfs(config.log.errorFile, {
  interval: '1d', // rotate daily
  path: logDirectory,
});

const accessLogStream = rfs(config.log.accessFile, {
  interval: '1d', // rotate daily
  path: logDirectory,
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(formatWinston.config()),
    new winston.transports.File({
      json: false,
      stream: errorLogStream,
      prettyPrint: true,
    }),
  ],
});

export const accessLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(formatWinston.config()),
    new winston.transports.File({
      json: false,
      stream: accessLogStream,
      prettyPrint: true,
    }),
  ],
});