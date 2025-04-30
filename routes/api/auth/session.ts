// deno-lint-ignore-file no-explicit-any
import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { fetchTeamById } from '../../../lib/newapi/teams/teams.ts';
import { fetchUserById } from '../../../lib/newapi/user/user.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies['session'];

    if (!session) return new Response('Unauthorized', { status: 401 });

    const sessions = (await kv.get(['sessions', session])).value as any;
    if (!sessions) return new Response('Session expired', { status: 403 });

    let val;

    if (ctx.url.searchParams.get('type') === 'user' && sessions.activeAccount)
      val = await fetchUserById(sessions.activeAccount);
    else if (ctx.url.searchParams.get('type') === 'team' && sessions.activeTeam)
      val = await fetchTeamById(sessions.activeTeam, sessions.accessToken);

    return new Response(JSON.stringify(val), {
      status: 200,
    });
  },
};
