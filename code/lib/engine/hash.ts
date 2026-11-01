import { createHash } from "node:crypto";

/** Stable hash of a normalised JSON body for cache keys. */
export function requestHash(body: unknown): string {
  const normalised = JSON.stringify(sortKeys(body));
  return createHash("sha256").update(normalised).digest("hex").slice(0, 24);
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      }, {});
  }
  return value;
}
