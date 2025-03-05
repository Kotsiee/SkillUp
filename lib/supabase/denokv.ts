const kv = await Deno.openKv(); // Opens Deno KV with SQLite in local development

// Function to cache data with an expiry time
export async function setCache(key: string, value: any, ttlSeconds: number) {
  const expiryTime = Date.now() + ttlSeconds * 1000;
  await kv.set(["cache", key], { value, expiryTime });
}

// Function to get cached data (and remove if expired)
export async function getCache(key: string) {
  const result = await kv.get(["cache", key]);
  if (!result.value) return null;

  // Check if the cache has expired
  if (Date.now() > result.value.expiryTime) {
    await kv.delete(["cache", key]); // Remove expired cache
    return null;
  }

  return result.value.value;
}

export async function cleanupCache() {
  for await (const entry of kv.list({ prefix: ["cache"] })) {
    if (Date.now() > entry.value.expiryTime) {
      await kv.delete(entry.key);
    }
  }
}
