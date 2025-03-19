import { Handlers } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const headers = new Headers();
    const cookies = getCookies(req.headers);
    const sessionId = cookies["session"];
  
    if (!sessionId) return new Response("Unauthorized", { status: 401 });
  
    await kv.delete(["sessions", sessionId]);
    deleteCookie(headers, "session", { path: "/" });
  
    return new Response(JSON.stringify({ message: "Logged out" }), { status: 200, headers });
  },
};
