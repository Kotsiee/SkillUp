import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies["session"];
    const sessionData = ((await kv.get(["sessions", session])).value  as any);
    const teamId = ctx.params.id

    kv.set(["sessions", session], {...sessionData, activeTeam: teamId})

    return new Response(JSON.stringify({ message: "Login successful", activeTeam: teamId }), {
        status: 200,
      });
  }
};
