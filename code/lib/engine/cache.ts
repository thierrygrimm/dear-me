import { requestHash } from "./hash";

type Entry<T> = { value: T; at: number };

const store = new Map<string, Entry<unknown>>();
const TTL_MS = 1000 * 60 * 30;

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > TTL_MS) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T): T {
  store.set(key, { value, at: Date.now() });
  return value;
}

export function cacheKey(namespace: string, body: unknown): string {
  return `${namespace}:${requestHash(body)}`;
}

export function cacheClear(): void {
  store.clear();
}
