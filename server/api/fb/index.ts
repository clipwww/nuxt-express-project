import { Router, NextFunction } from 'express';

import { crawlerFacebookFanPage } from '../../../utilities/fb.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/:fbId', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { fbId } = req.params;

  res.result = await crawlerFacebookFanPage(fbId);

  next();
});

export default router;
