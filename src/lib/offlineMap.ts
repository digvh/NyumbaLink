
// src/lib/offlineMap.ts

const CACHE_NAME = 'nyumbalink-map-tiles-v1';
const MAX_TILES = 500; // Cap to avoid huge storage

/**
 * Simple tile cache using the Cache API.
 * When online: caches tiles as they're fetched.
 * When offline: serves from cache.
 */
export async function setupTileCache() {
  if (typeof window === 'undefined') return;
  if (!('caches' in window)) return;

  try {
    await caches.open(CACHE_NAME);
  } catch {
    /* ignore */
  }
}

export async function cacheTile(url: string): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    const existing = await cache.match(url);
    if (existing) return;
    const res = await fetch(url);
    if (res.ok) {
      await cache.put(url, res.clone());
      await trimCache();
    }
  } catch {
    /* ignore */
  }
}

export async function getCachedTile(url: string): Promise<Response | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(url)) ?? null;
  } catch {
    return null;
  }
}

async function trimCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    if (keys.length <= MAX_TILES) return;
    // Remove oldest entries beyond the cap
    const toDelete = keys.length - MAX_TILES;
    for (let i = 0; i < toDelete; i++) {
      await cache.delete(keys[i]);
    }
  } catch {
    /* ignore */
  }
}

export async function getCacheStats(): Promise<{ count: number }> {
  if (typeof window === 'undefined' || !('caches' in window)) return { count: 0 };
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return { count: keys.length };
  } catch {
    return { count: 0 };
  }
}

export async function clearTileCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    await caches.delete(CACHE_NAME);
  } catch {
    /* ignore */
  }
}