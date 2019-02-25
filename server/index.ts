import express from 'express';
import api from './api';
import { expressWinstonLogger, expressWinstonErrorLogger } from '../utilities/logger.util';
import { responseEndMiddleware } from './middlewares';

const app = express();

app.use(expressWinstonLogger);

// Import API Routes
app.use('/api', api, responseEndMiddleware);

app.use(expressWinstonErrorLogger);

export default app;
