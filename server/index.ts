import express from 'express';
import api from './api';

process.env.DEBUG = 'nuxt:*';

const app = express();

// Import API Routes
app.use('/api', api);

export default app;
