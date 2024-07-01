import { getCache } from './getCache.server';

export const invalidateCache = (key: string): void => {
  const cache = getCache();
  cache.delete(key);
};
