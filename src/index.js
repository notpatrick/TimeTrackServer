import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import api from './api/index';
import config from './config.json';
import {
  accessLogger,
  errorLogger,
} from './lib/log';

const app = express();
app.server = http.createServer(app);

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