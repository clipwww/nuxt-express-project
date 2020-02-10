import { Router, NextFunction } from 'express';

import { crawlerInstagramFanPage } from '../../../utilities/ig.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/:igId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { igId } = req.params;

  try {
    res.result = await crawlerInstagramFanPage(igId);
  } catch (err) {
    res.status(500).end(err.message);
    return;
  }

  next();
});

export default router;
