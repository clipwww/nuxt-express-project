import express from 'express';
import api from './api';
import { expressWinstonLogger, expressWinstonErrorLogger } from '../utilities/logger.util';
import { responseEndMiddleware } from './middlewares';

const app = express();

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(expressWinstonLogger);

// Import API Routes
app.use('/api', api, responseEndMiddleware);

app.use(expressWinstonErrorLogger);

export default app;
