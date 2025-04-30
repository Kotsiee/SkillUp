import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { addTeam } from '../../../lib/newapi/teams/teams.ts';
import { Team } from '../../../lib/newtypes/index.ts';
import { getCachedUser } from '../../../lib/utils/cache.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const cookies = getCookies(req.headers);
      const sessionId = cookies['session'];

      if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Missing session' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { accessToken, user } = await getCachedUser(req, kv);

      if (!accessToken || !user) {
        return new Response(JSON.stringify({ error: 'Invalid session or user' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const body = (await req.json()) as Omit<Team, 'createdAt'>;

      if (!body) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await addTeam(user, body, accessToken);

      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[POST /teams/create]', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
