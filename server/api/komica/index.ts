import { Router, NextFunction } from 'express';
import { NSKomica } from '../../../utilities/komica.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/live', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  res.result = await NSKomica.getKomicaListResult('live', req.query.p);

  next();
});

router.get('/live/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  res.result = await NSKomica.getKomicaDetailsResult('live', req.params.id);

  next();
});

export default router;
