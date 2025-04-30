// api/auth/logout.ts

import { Handlers } from '$fresh/server.ts';
import { deleteCookie, getCookies } from '$std/http/cookie.ts';

export const handler: Handlers = {
  async POST(req, _ctx) {
    const headers = new Headers();
    const cookies = getCookies(req.headers);
    const sessionId = cookies['session'];

    if (!sessionId) return new Response('Unauthorized', { status: 401 });

    try {
      const kv = await Deno.openKv();
      await kv.delete(['sessions', sessionId]);
      deleteCookie(headers, 'session', { path: '/' });

      return new Response(JSON.stringify({ message: 'Logged out' }), {
        status: 200,
        headers,
      });
    } catch (err) {
      console.error('Logout failed:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
