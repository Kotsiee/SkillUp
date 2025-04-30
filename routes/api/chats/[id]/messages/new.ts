import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { addMessage } from '../../../../../lib/newapi/chats/messages.ts';
import { Messages } from '../../../../../lib/newtypes/index.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, ctx) {
    const chatId = ctx.params.id;
    const cookies = getCookies(req.headers);
    const session = cookies['session'];

    if (!session) {
      return new Response(JSON.stringify({ error: 'Missing session cookie' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionData = (await kv.get(['sessions', session])).value as any;
    if (!sessionData) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const currentUser = sessionData.accounts?.find(
      (acc: any) => acc.id === sessionData.activeAccount
    );

    if (!currentUser || !currentUser.accessToken) {
      return new Response(JSON.stringify({ error: 'Invalid user in session' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = (await req.json()) as Omit<Messages, 'id'>;

      if (!body || !body.chatid || !body.user || !body.content) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await addMessage(body, currentUser.accessToken);

      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[POST /messages/new]', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
