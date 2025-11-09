import { LRUCache } from "lru-cache";

const options = {
  // Store up to 100 items
  max: 100,
  // Items are valid for 5 minutes
  ttl: 1000 * 60 * 5,
};

class CacheManager {
  private static _instance: CacheManager;
  public cache: LRUCache<any, any>;

  private constructor() {
    this.cache = new LRUCache(options);
  }

  public static getInstance(): CacheManager {
    if (!this._instance) {
      this._instance = new CacheManager();
    }
    return this._instance;
  }
}

/**
 * A singleton LRUCache instance to be shared across the server.
 * It's auto-imported by Nuxt 3 in the server directory.
 */
export const cache = CacheManager.getInstance().cache;
