import { getCookies } from '$std/http/cookie.ts';
import { Handlers } from '$fresh/server.ts';
import { confirmEmail } from '../../../lib/newapi/user/auth.ts';

export const handler: Handlers = {
  GET(req) {
    const newUserId = getCookies(req.headers)['newUserId'] || null;
    const newUserEmail = getCookies(req.headers)['newUserEmail'] || null;

    return new Response(JSON.stringify({ id: newUserId, email: newUserEmail }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },

  async POST(req) {
    try {
      const email = getCookies(req.headers)['newUserEmail'] || null;

      if (!email) {
        return new Response(JSON.stringify({ error: 'Missing email' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await confirmEmail(email);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      return new Response(JSON.stringify({ error: 'Failed to resend email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
