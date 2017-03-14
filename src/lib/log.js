import fs from 'fs';
import path from 'path';
import rfs from 'rotating-file-stream';
import winston from 'winston';
import expressWinston from 'express-winston';
import config from '../config.json';

// log bodies
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

// ensure log directory exists
const logDirectory = path.join(__dirname, '../', config.log.path);
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = rfs(config.log.accessFile, {
  interval: '1d', // rotate daily
  path: logDirectory,
});

export default expressWinston.logger({
  transports: [
    // new winston.transports.Console(formatWinston.config()),
    new winston.transports.File({
      json: false,
      stream: accessLogStream,
      prettyPrint: true,
    }),
  ],
});