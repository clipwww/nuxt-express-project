import { Router } from 'express';
import komica from './komica';
import niconico from './niconico';

const router = Router();

// Add Routes
router.use('/komica', komica)
  .use('/niconico', niconico);

export default router;
