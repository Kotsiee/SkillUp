import { Handler } from "$fresh/server.ts";

const kv = await Deno.openKv();

export const handler: Handler = async (req) => {
  if (req.method === "POST") {
    const { userId, name } = await req.json();
    await kv.set(["user", userId], { name, timestamp: Date.now() });

    return new Response("User stored", { status: 200 });
  }

  if (req.method === "GET") {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) return new Response("Missing userId", { status: 400 });

    const user = await kv.get(["user", userId]);
    if (!user.value) return new Response("User not found", { status: 404 });

    return new Response(JSON.stringify(user.value), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
