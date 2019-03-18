import { Router } from 'express';
import komica from './komica';
import niconico from './niconico';
import movie from './movie';

const router = Router();

// Add Routes
router.use('/komica', komica)
  .use('/niconico', niconico)
  .use('/movie', movie);

export default router;
