import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import superjson from 'https://esm.sh/superjson@2.2.2';

import { getCachedUser } from '../../../../lib/utils/cache.ts';
import { fetchChatById } from '../../../../lib/newapi/chats/chats.ts';

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

      const chat = await fetchChatById(ctx.params.id, accessToken);

      return new Response(superjson.stringify(chat), {
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
