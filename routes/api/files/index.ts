import { FreshContext, Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import superjson from 'https://esm.sh/superjson@2.2.2';
import { getCachedUser } from '../../../lib/utils/cache.ts';
import { fetchFilesByUserId, insertFile } from '../../../lib/newapi/files/files.ts';

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
      const files = await fetchFilesByUserId(user, accessToken);

      return new Response(JSON.stringify(files), {
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

  async POST(req, _ctx) {
    // const cookies = getCookies(req.headers);
    // const session = cookies['session'];
    // // deno-lint-ignore no-explicit-any
    // const sessions = (await kv.get(['sessions', session])).value as any;
    // const accessToken = sessions.accounts[0].accessToken;
    // console.log('access token:', accessToken);

    // const file = await req.formData();
    // const newFile = JSON.parse(file.get('file')?.toString() || '');

    // const files = await insertFile('user_uploads', newFile, accessToken);

    // return new Response(superjson.stringify(files), {
    //   headers: { 'Content-Type': 'text/plain' },
    // });

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
      const chats = await insertFile('user_uploads', {}, accessToken);

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
