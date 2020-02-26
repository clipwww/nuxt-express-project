import { Router, NextFunction } from 'express';

import { NSKomica } from '../../../utilities/komica.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';
import { fireStore } from '../../db/firebase.db';
import { ResultListGenericVM, ResultGenericVM } from '../../../view-models/result.vm';

const router = Router();

router.get('/:board', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board } = req.params;
  const { p = 1 } = req.query
  res.result = await NSKomica.getKomicaListResult(board, p);

  if (!res.result.success) {
    next();
    return;
  }

  try {
    const listRef = fireStore.collection('komica').doc(`${board}-list-${p}`)
    listRef.set({
      items: (res.result as ResultListGenericVM<NSKomica.ListResultVM>).items,
      dateUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.log(err)
  }

  next();
});

router.get('/:board/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board, id } = req.params;
  res.result = await NSKomica.getKomicaDetailsResult(board, id);

  if (!res.result.success) {
    next();
    return;
  }

  try {
    const listRef = fireStore.collection('komica').doc(`${board}-details-${id}`)
    listRef.set({
      items: (res.result as ResultGenericVM<NSKomica.DetailsResultVM>).item,
      dateUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.log(err)
  }

  next();
});

export default router;
