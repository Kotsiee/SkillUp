import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import superjson from 'https://esm.sh/superjson@2.2.2';

import { getCachedUser } from '../../../../lib/utils/cache.ts';
import { fetchMessagesByChatId } from '../../../../lib/newapi/chats/messages.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // 1. Parse query params
      const url = new URL(req.url);
      const hasAttachments = url.searchParams.get('hasAttachments') === 'true';

      // 2. Get session and accessToken
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

      // 3. Fetch all messages
      let messages = await fetchMessagesByChatId(ctx.params.id, accessToken);

      // 4. Optionally filter for attachments
      if (hasAttachments) {
        messages = messages.filter(msg => msg.attachments && msg.attachments.length > 0);
      }

      return new Response(superjson.stringify(messages), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Error fetching messages:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
