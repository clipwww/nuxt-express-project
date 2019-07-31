import { Router, NextFunction } from 'express';
import { NSLKComic } from '../../../utilities/lkcomic.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/list', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { p = 1 } = req.query;
  res.result = await NSLKComic.getList(p);

  next();
});

router.get('/details/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { id } = req.params;
  res.result = await NSLKComic.getDetails(id);

  next();
});

export default router;
