import { LRUCache } from 'lru-cache';
import { CacheEntry } from '@epic-web/cachified';
import { ONE_HOUR } from './constants';

type CacheType = LRUCache<string, CacheEntry>;

let cacheInstance: CacheType | undefined;

export const getCache = (): CacheType => {
  if (!cacheInstance) {
    cacheInstance = new LRUCache({
      max: 1000,
      ttl: ONE_HOUR,
    });
  }

  return cacheInstance;
};
