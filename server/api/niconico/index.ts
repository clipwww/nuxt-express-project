import { Router, NextFunction } from 'express';
import { NSNiconico } from '../../../utilities/niconico.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/search/:service', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { service } = req.params;

  res.result = await NSNiconico.searchResult(service, req.query);

  next();
});

router.get('/:service/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { service, id } = req.params;

  res.result = await NSNiconico.getXmlToJsonData(service, id);

  next();
});

export default router;
