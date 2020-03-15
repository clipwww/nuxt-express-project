import { Router, NextFunction } from 'express';

import { crawlerHimawariList, crawlerHimawariDetails } from '../../../utilities/himawari.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/list', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { sort, keyword, cat, page } = req.query;

  try {
    res.result = await crawlerHimawariList({
      sort: sort as string,
      keyword: keyword as string,
      cat: cat as string,
      page: page as number,
    });
  } catch (err) {
    res.status(500).end(err.message);
    return;
  }

  next();
});

router.get('/douga/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { id } = req.params;

  try {
    res.result = await crawlerHimawariDetails(id as string);
  } catch (err) {
    res.status(500).end(err.message);
    return;
  }

  next();
});

export default router;
