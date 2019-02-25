import express from 'express';
import api from './api';
import { responseEndMiddleware } from './middlewares';

const app = express();

// Import API Routes
app.use('/api', api, responseEndMiddleware);

export default app;
