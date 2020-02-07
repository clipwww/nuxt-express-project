import { Router, NextFunction } from 'express';

import { crawlerInstagramFanPage } from '../../../utilities/ig.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/:igId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { igId } = req.params;

  res.result = await crawlerInstagramFanPage(igId);

  next();
});

export default router;
