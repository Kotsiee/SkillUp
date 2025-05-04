import { getCookies } from '$std/http/cookie.ts';
import { Handlers } from '$fresh/server.ts';
import { getCachedUser } from '../../../lib/utils/cache.ts';
import { fetchProfileByHandle } from '../../../lib/newapi/user/profile.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
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

      console.log(ctx.params.id);
      const profile = await fetchProfileByHandle(ctx.params.id, accessToken);

      return new Response(JSON.stringify(profile), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Error fetching chat:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
