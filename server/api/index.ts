import { Router } from 'express';
import komica from './komica';
import niconico from './niconico';
import movie from './movie';
import anime1 from './anime1';
import lk from './lk';
import fb from './fb';
import pharmacy from './pharmacy';

const router = Router();

// Add Routes
router.use('/komica', komica)
  .use('/niconico', niconico)
  .use('/movie', movie)
  .use('/anime1', anime1)
  .use('/lk', lk)
  .use('/fb', fb)
  .use('/pharmacy', pharmacy);

export default router;
