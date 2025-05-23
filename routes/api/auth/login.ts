// deno-lint-ignore-file no-explicit-any
// routes/api/auth/login.ts
import { Handlers } from '$fresh/server.ts';
import { getCookies, setCookie } from '$std/http/cookie.ts';
import { loginUser } from '../../../lib/newapi/user/auth.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req) {
    try {
      const cookies = getCookies(req.headers);
      const currentSession = cookies['session'];

      const form = await req.formData();
      const email = form.get('email')?.toString();
      const password = form.get('password')?.toString();

      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { user: loggedInUser, session: loginSession } = await loginUser(email, password);

      if (!loggedInUser || !loginSession) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
        });
      }

      const user = loggedInUser;
      const session = loginSession;
      const sessionId = currentSession || crypto.randomUUID(); // Unique session ID for this login
      const refreshToken = session.refresh_token;
      const accessToken = session.access_token;
      const ip = req.headers.get('X-Forwarded-For') || req.headers.get('CF-Connecting-IP');
      const userAgent = req.headers.get('User-Agent');

      // Fetch existing linked accounts from KV
      const existingSession = await kv.get(['sessions', sessionId]);
      const accounts = (existingSession?.value as any)?.accounts || [];

      // If user's main account isn't stored yet, add it
      if (!accounts.some((acc: any) => acc.id === user.id)) {
        accounts.push({
          id: user.id,
          email: user.email,
          refreshToken,
          accessToken,
          tokenUpdated: Date.now(),
        });
      }

      // Store session in KV
      await kv.set(['sessions', sessionId], {
        activeAccount: user.id,
        accounts,
        ip,
        userAgent,
        createdAt: Date.now(),
      });

      // Set HttpOnly cookies for session management
      const headers = new Headers();
      setCookie(headers, {
        name: 'session',
        value: sessionId,
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
      });

      return new Response(
        JSON.stringify({
          message: 'Login successful',
          activeAccount: loggedInUser.id,
          user: loggedInUser,
        }),
        {
          status: 200,
          headers,
        }
      );
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Unexpected server error';

      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
