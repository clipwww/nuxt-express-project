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

router.get('/theater', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { cityId } = req.query;

  res.result = await NSMovie.getTheaterList(cityId as string);

  next();
});

router.get('/times/:movieId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { movieId } = req.params;
  const { cityId } = req.query;

  res.result = await NSMovie.getMovieTimes(movieId, cityId as string);

  next();
});

router.get('/theater/:theaterId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { theaterId } = req.params;
  const { date, cityId } = req.query;

  res.result = await NSMovie.getTheaterTimes(theaterId, cityId as string, date as string);

  next();
});

export default router;
