import { Router, NextFunction } from 'express';

import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';
import { ResultListGenericVM } from '../../../view-models/result.vm';
const twPharmacy = require('../../json/TW-pharmacy.json')

const router = Router();

router.get('/tw', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const result = new ResultListGenericVM<any>();
  result.items = twPharmacy;
  res.result = result;

  next();
});

export default router;
