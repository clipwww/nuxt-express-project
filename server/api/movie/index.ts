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

router.get('/theater/:cityId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { cityId } = req.params;

  res.result = await NSMovie.getTheaterList(cityId);

  next();
});

router.get('/times/:movieId/:cityId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { movieId, cityId } = req.params;

  res.result = await NSMovie.getMovieTimes(movieId, cityId);

  next();
});

router.get('/times/:theaterId/:cityId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { theaterId, cityId } = req.params;
  const { date } = req.query;

  res.result = await NSMovie.getTheaterTimes(theaterId, cityId, date as string);

  next();
});

export default router;
