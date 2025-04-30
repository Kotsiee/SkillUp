import { Handlers } from '$fresh/server.ts';
import { setCookie } from '$std/http/cookie.ts';
import { registerUser } from '../../../lib/newapi/user/auth.ts';

export const handler: Handlers = {
  async POST(req) {
    try {
      const formData = await req.formData();
      const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      if (!userData.email || !userData.password) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await registerUser(userData.email, userData.password);
      if (!result) {
        return new Response(JSON.stringify({ error: 'User registration failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const headers = new Headers();
      setCookie(headers, {
        name: 'newUserId',
        value: result.id,
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
      });

      setCookie(headers, {
        name: 'newUserEmail',
        value: userData.email,
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
      });

      headers.set('Location', '/account/confirm');

      return new Response(JSON.stringify(result), {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
