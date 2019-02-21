import express from 'express';
import api from './api';

const app = express();

// Import API Routes
app.use('/api', api);

export default app;
