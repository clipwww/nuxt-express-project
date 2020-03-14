import { Router, NextFunction } from 'express';
import _isEqual from 'lodash/isEqual'

import { NSKomica } from '../../../utilities/komica.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';
import { fireStore } from '../../db/firebase.db';
import { ResultListGenericVM, ResultGenericVM, ResultCode } from '../../../view-models/result.vm';

const router = Router();

router.get('/:board', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board } = req.params;
  const { p = 1, mode = '' } = req.query
  res.result = mode === 'all' ? await NSKomica.getKomicaAllPostResult(board) : await NSKomica.getKomicaListResult(board, p);

  next();
});

router.get('/:board/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { board, id } = req.params;
  res.result = await NSKomica.getKomicaDetailsResult(board, id);
  const listRef = fireStore.collection('komica').doc(`${board}-details-${id}`)

  if (!res.result.success) {
    const snapshot = await listRef.get();
    const data = snapshot.data();
    const oldItem = data ? data.item : null;

    if (oldItem) {
      res.result.success = true;
      res.result.resultCode = ResultCode.success;
      (res.result as NSKomica.DetailsResultVM).item = oldItem;
    }

    next();
    return;
  }

  try {
    const newItem = (res.result as NSKomica.DetailsResultVM).item;
    listRef.get().then(snapshot => {
      const data = snapshot.data();
      const oldItem = data ? data.item : null;
      if (!oldItem || !_isEqual(newItem.reply.length, oldItem.reply.length)) {
        listRef.set({
          item: newItem,
          dateUpdated: new Date().toISOString()
        });
      }
    })

  } catch (err) {
    console.log(err)
  }

  next();
});

export default router;
