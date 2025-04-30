// deno-lint-ignore-file no-explicit-any
import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { fetchUserById } from '../../../lib/newapi/user/user.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies['session'];

    if (!session) return new Response('Unauthorized', { status: 401 });

    const sessionData = (await kv.get(['sessions', session])).value as any;
    if (!sessionData) return new Response('Session expired', { status: 403 });

    const newAccountId = (await req.formData()).get('newAccountId')?.toString().replaceAll('"', '');
    const validAccount = sessionData.accounts.find((acc: any) => acc.id === newAccountId);

    if (!validAccount) {
      return new Response('Account not found', { status: 403 });
    }

    sessionData.activeAccount = newAccountId;
    await kv.set(['sessions', session], sessionData);

    const user = await fetchUserById(sessionData.activeAccount);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  },

  async GET(req, _ctx) {
    try {
      const cookies = getCookies(req.headers);
      const session = cookies['session'];

      if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }

      const sessionData = (await kv.get(['sessions', session])).value as any;
      if (!sessionData || !sessionData.accounts || sessionData.accounts.length === 0) {
        return new Response(JSON.stringify({ error: 'Session expired or no accounts found' }), {
          status: 403,
        });
      }

      const users = await Promise.all(
        sessionData.accounts.map((acc: any) => {
          return fetchUserById(acc.id);
        })
      );

      return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in GET handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  },
};
