import { Router, NextFunction } from 'express';
import _isEqual from 'lodash/isEqual'
import LRU from 'lru-cache';

import { crawlerInstagramFanPage } from '../../../utilities/ig.util';
import { RequestExtension, ResponseExtension } from '../../../view-models/extension.vm';
import { HashtagResultVM, fetchMultipleIgHashTag } from '../../../utilities/ig-hashtag.util';
// import { fireStore } from '../../db/firebase.db';

const lruCache = new LRU({
  max: 10000,
  maxAge: 1000 * 60 * 10,
});

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

router.get('/hashtag/go', async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const hashtag = 'goshare,gosharetw,gogoro';
  const skipCache = req.query.skip_cache === '1';
  const end_cursors = req.query.end_cursors as string[];


  const cacheKey = hashtag + (Array.isArray(end_cursors) ? end_cursors.join(',') : end_cursors);
  const cacheValue = lruCache.get(cacheKey);
  // const listRef = fireStore.collection('hashtag').doc(cacheKey)

  if (cacheValue && !skipCache) {
    const { posts, page_info } = cacheValue as HashtagResultVM;

    res.result = {
      success: true,
      // @ts-ignore
      hashtag,
      posts,
      page_info,
      cache: true,
    }
    next();
    return;
  }

  const { posts, page_info } = await fetchMultipleIgHashTag(hashtag.split(','), end_cursors);

  if (posts.length) {
    lruCache.set(cacheKey, {
      posts,
      page_info
    });
  }

  // try {
  //   listRef.get().then(snapshot => {
  //     const data = snapshot.data();
  //     const oldPosts = data ? data.posts : [];
  //     if (posts.length && !_isEqual(oldPosts, posts)) {
  //       listRef.set({
  //         posts,
  //         page_info,
  //         dateUpdated: new Date().toISOString()
  //       });
  //     }
  //   })

  // } catch (err) {
  //   console.log(err)
  // }

  res.result = {
    success: true,
    // @ts-ignore
    hashtag,
    posts,
    page_info
  }

  next()
});

export default router;
