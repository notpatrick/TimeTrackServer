import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import rfs from 'rotating-file-stream';
import winston from 'winston';
import expressWinston from 'express-winston';
import formatWinston from 'winston-console-formatter';
import initializeDb from './db';
import api from './api';
import config from './config.json';

const app = express();
app.server = http.createServer(app);

// ensure log directory exists
const logDirectory = path.join(__dirname, 'log');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

// create rotating write streams
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});
const errorLogStream = rfs('error.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});
const accessLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(formatWinston.config()),
    new winston.transports.File({
      json: false,
      stream: accessLogStream,
      prettyPrint: true,
    }),
  ],
});
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(formatWinston.config()),
    new winston.transports.File({
      json: false,
      stream: errorLogStream,
      prettyPrint: true,
    }),
  ],
});

// log bodies
expressWinston.requestWhitelist.push('body');

// allow cross origin requests
app.use(cors({
  exposedHeaders: config.corsHeaders,
}));
// limit body size
app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

// connect to db
initializeDb((db) => {
  // log requests before router
  app.use(accessLogger);
  // api router
  app.use('/api', api({
    config,
    db,
  }));
  // error logging after router
  app.use(errorLogger);

  app.server.listen(process.env.PORT || config.port);
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;