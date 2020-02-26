import { Router, NextFunction } from 'express';
import m3u8stream from 'm3u8stream';
import moment from 'moment';

import { NSAnime1 } from '../../../utilities/anime1.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';
import { ResultListGenericVM, ResultCode } from '../../../view-models/result.vm';
import { fireStore } from '../../db/firebase.db';

const router = Router();

router.get('/list', async (_req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const listRef = fireStore.collection('bangumi').doc('list')
  const listData = await listRef.get().then(doc => doc.data());
  if (listData && moment().isBefore(listData.dateExpired)) {
    const result = new ResultListGenericVM<NSAnime1.BangumiData>();
    result.items = listData.items;
    result.setResultValue(true, ResultCode.notModified)

    res.result = result;
    next();
    return;
  }

  res.result = await NSAnime1.getList();
  if (!res.result.success) {
    next();
    return;
  }

  try {
    listRef.set({
      items: (res.result as ResultListGenericVM<NSAnime1.ListData>).items,
      dateExpired: moment().add(1, 'minute').toISOString()
    }, { merge: true });
  } catch (err) { console.log(err) }

  next();
});

router.get('/bangumi/:id', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const { id } = req.params;

  const bangumiRef = fireStore.collection('bangumi').doc(id)
  const bangumiData = await bangumiRef.get().then(doc => doc.data());

  if (bangumiData && moment().isBefore(bangumiData.dateExpired)) {
    const result = new ResultListGenericVM<NSAnime1.BangumiData>();
    result.items = bangumiData.items;
    result.item = {
      id,
      title: bangumiData.title,
    }
    result.setResultValue(true, ResultCode.notModified)

    res.result = result;
    next();
    return;
  }

  res.result = await NSAnime1.getBangumi(id);

  if (!res.result.success) {
    next();
    return;
  }

  try {
    let minute = 1;
    const item = (res.result as ResultListGenericVM<any>).item;
    const items = (res.result as ResultListGenericVM<NSAnime1.BangumiData>).items;
    const datePublished = items[0].datePublished;

    switch (true) {
      case moment(datePublished).add(1, 'year').isBefore():
        minute = 60 * 24 * 365;
        break;
      case moment(datePublished).add(1, 'month').isBefore():
        minute = 60 * 24 * 30;
        break;
      case moment(datePublished).add(2, 'week').isBefore():
        minute = 60 * 24 * 7;
        break;
      case moment(datePublished).isSame(moment(), 'day'):
        minute = 60 * 24;
        break;
    }
    bangumiRef.set({
      id,
      items,
      title: item.title,
      dateExpired: moment().add(minute, 'minute').toISOString()
    }, { merge: true });
  } catch (err) {
    console.log(err);
  }

  next();
});

router.get('/download/m3u8', async (req: RequestExtension, res: ResponseExtension) => {
  const { url, name } = req.query;

  const m3u8Url = await NSAnime1.getM3u8Url(url as string);
  console.log('[m3u8Url]', m3u8Url);
  const stream = m3u8stream(m3u8Url);

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
