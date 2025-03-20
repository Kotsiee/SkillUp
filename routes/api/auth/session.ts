// deno-lint-ignore-file no-explicit-any
import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { fetchUserByID } from "../../../lib/api/user/user.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, _ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies["session"];

    if (!session) return new Response("Unauthorized", { status: 401 });

    const sessions = (await kv.get(["sessions", session])).value as any;
    if (!sessions) return new Response("Session expired", { status: 403 });

    const user = await fetchUserByID(sessions.activeAccount);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  },
};
