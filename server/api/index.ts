import { Router } from 'express';
import komica from './komica';

const router = Router();

// Add USERS Routes
router.use('/komica', komica);

export default router;
