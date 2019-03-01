import { Router, NextFunction } from 'express';
import { NSKomica } from '../../../utilities/komica.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

const router = Router();

router.get('/:board', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board } = req.params;
  res.result = await NSKomica.getKomicaListResult(board, req.query.p);

  next();
});

router.get('/:board/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board, id } = req.params;
  res.result = await NSKomica.getKomicaDetailsResult(board, id);

  next();
});

export default router;
