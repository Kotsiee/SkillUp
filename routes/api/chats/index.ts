import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';

import { getCachedUser } from '../../../lib/utils/cache.ts';
import { fetchChatsByUserId } from '../../../lib/newapi/chats/chats.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      // Retrieve session from cookies
      const cookies = getCookies(req.headers);
      const sessionId = cookies['session'];

      if (!sessionId) {
        return new Response(JSON.stringify({ error: 'No session cookie provided' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get cached session & user
      const { user, accessToken } = await getCachedUser(req, kv);
      if (!user || !accessToken) {
        return new Response(JSON.stringify({ error: 'Invalid session or user not found' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Fetch chats using user ID and accessToken
      const chats = await fetchChatsByUserId(user, accessToken);

      return new Response(JSON.stringify(chats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Error fetching user chats:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
