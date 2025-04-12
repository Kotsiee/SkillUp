import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { fetchTeamByID } from "../../../lib/api/teams/teams.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, _ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies["session"];
    const sessionData = ((await kv.get(["sessions", session])).value  as any);

    const team = await fetchTeamByID(sessionData.activeTeam)

    return new Response(JSON.stringify(team), {
        status: 200,
      });
  }
};
