// deno-lint-ignore-file no-explicit-any
import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { fetchTeamByID } from "../../../lib/api/teams/teams.ts";
import { fetchUserByID } from "../../../lib/api/user/user.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies["session"];

    if (!session) return new Response("Unauthorized", { status: 401 });

    const sessions = (await kv.get(["sessions", session])).value as any;
    if (!sessions) return new Response("Session expired", { status: 403 });

    let val;

    if (ctx.url.searchParams.get("type") === "user")
      val = await fetchUserByID(sessions.activeAccount)
    else if (ctx.url.searchParams.get("type") === "team")
      val = await fetchTeamByID(sessions.activeTeam)

    return new Response(JSON.stringify(val), {
      status: 200,
    });
  },
};
