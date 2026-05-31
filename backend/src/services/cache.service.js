import redis from '../config/redis.js';

export const cacheService = {
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async set(key, value, ttlSeconds = 300) {
    try {
      await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
      console.error('[Cache] Set error:', err);
    }
  },

  async del(key) {
    try {
      await redis.del(key);
    } catch (err) {
      console.error('[Cache] Del error:', err);
    }
  },

  async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (err) {
      console.error('[Cache] Invalidate error:', err);
    }
  },
};
