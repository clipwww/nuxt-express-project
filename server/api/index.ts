import { Router } from 'express';
import komica from './komica';
import niconico from './niconico';
import movie from './movie';
import anime1 from './anime1';
import lk from './lk';
import fb from './fb';
import pharmacy from './pharmacy';
import ig from './ig';
import himawari from './himawari';

const router = Router();

// Add Routes
router
  // .use('/v2', v2)
  .use('/komica', komica)
  .use('/niconico', niconico)
  .use('/movie', movie)
  .use('/anime1', anime1)
  .use('/lk', lk)
  .use('/fb', fb)
  .use('/pharmacy', pharmacy)
  .use('/ig', ig)
  .use('/himawari', himawari);

export default router;
