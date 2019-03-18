import { Router, NextFunction } from 'express';
import { NSMovie } from '../../../utilities/movie.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/city', async (_req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

  res.result = await NSMovie.getCityList();

  next();
});

router.get('/list', async (_req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

  res.result = await NSMovie.getMovieList();

  next();
});

router.get('/times/:movieId/:cityId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { movieId, cityId } = req.params;

  res.result = await NSMovie.getMovieTimes(movieId, cityId);

  next();
});

export default router;
