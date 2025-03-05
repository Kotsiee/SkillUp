/// <reference lib="deno.unstable" />

import { Handler } from "$fresh/server.ts";

const kv = await Deno.openKv();

export const handler: Handler = async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) return new Response("Missing key", { status: 400 });

  // Check cache
  const cachedData = await kv.get(["cache", key]);
  if (cachedData.value) {
    return new Response(JSON.stringify({ cached: true, data: cachedData.value }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Simulated fetch operation
  const fetchedData = { message: `Hello from API at ${new Date().toISOString()}` };

  // Cache the data for 30 seconds
  await kv.set(["cache", key], fetchedData, { expireIn: 30 });

  return new Response(JSON.stringify({ cached: false, data: fetchedData }), {
    headers: { "Content-Type": "application/json" },
  });
};
