import { Router, NextFunction } from 'express';
import { NSAnime1 } from '../../../utilities/anime1.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';

import m3u8stream from 'm3u8stream';


const router = Router();

router.get('/list', async (_req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

  res.result = await NSAnime1.getList();

  next();
});

router.get('/bangumi/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { id } = req.params;
  res.result = await NSAnime1.getBangumi(id);

  next();
});

router.get('/download/m3u8', async (req: RequestExtension, res: ResponseExtension) => {
  const { url, name } = req.query;

  const stream = m3u8stream(url as string);

  stream.on('progress', (segment, totalSegments, downloaded) => {
    console.log(
      `${segment.num} of ${totalSegments} segments ` +
      `(${(segment.num / totalSegments * 100).toFixed(2)}%) ` +
      `${(downloaded / 1024 / 1024).toFixed(2)}MB downloaded`);
  });

  res.setHeader('Content-disposition', `attachment; filename=${name || +new Date()}.mp4`);
  res.setHeader('Content-type', 'video/mp4');

  stream.pipe(res)
});

router.get('/download/mp4', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { url } = req.query;

  const mp4Url = await NSAnime1.getMp4Url(url as string);

  console.log(mp4Url);
  if (!mp4Url) {
    throw Error('MP4 URL Not Found.');
  }

  res.redirect(mp4Url)
});

export default router;
