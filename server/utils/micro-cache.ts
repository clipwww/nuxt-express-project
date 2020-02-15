import LRU from 'lru-cache';

export const cacheOption = {
  // ref. https://stackoverflow.com/questions/24229753/node-js-lru-cache-package-max-parameter
  // max 單位根據length 預設length為return 1
  // 相當於每塞一個cache key + 1  最多可塞10000筆
  // 超過的時候lru-cache會將最久沒使用的key剔除
  max: 10000,
  // length(n, key) {
  //   return 1;
  // },
  maxAge: 1000 * 60,
};

class MicroCache {

  public static getInstance(): LRU.Cache<{}, {}> {
    if (MicroCache.instance === null) {
      MicroCache.instance = new LRU(cacheOption);
    }
    return MicroCache.instance;
  }

  private static instance: LRU.Cache<{}, {}> = null;
}

export const microCache = MicroCache.getInstance();
