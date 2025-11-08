import type { HAEntity } from './types.js';

export class EntityCache {
  private cache: Map<string, { data: HAEntity[], timestamp: number }> = new Map();
  private ttl: number = 5000; // 5 seconds default TTL

  constructor(ttl?: number) {
    if (ttl) this.ttl = ttl;
  }

  set(key: string, data: HAEntity[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): HAEntity[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  setTTL(ttl: number): void {
    this.ttl = ttl;
  }
}

// Singleton cache instance
export const entityCache = new EntityCache();
