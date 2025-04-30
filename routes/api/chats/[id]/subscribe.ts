// routes/api/chats/[id]/subscribe.ts

import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { getCachedUser } from '../../../../lib/utils/cache.ts';
import { subscribeToMessages } from '../../../../lib/newapi/chats/messages.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const chatId = ctx.params.id;

    const cookies = getCookies(req.headers);
    const sessionId = cookies['session'];

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Missing session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { accessToken } = await getCachedUser(req, kv);

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Invalid session or user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        console.log('SSE Connection Started');

        const sub = subscribeToMessages(chatId, accessToken, event => {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        });

        req.signal.addEventListener('abort', () => {
          console.log('SSE Connection Closed');
          sub.unsubscribe();
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  },
};
