import { getCookies } from '$std/http/cookie.ts';
import { Handlers } from '$fresh/server.ts';
import { fetchSubmissionsByJobId } from '../../../../lib/newapi/projects/submissions.ts';
import { getCachedUser } from '../../../../lib/utils/cache.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
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

      const submission = await fetchSubmissionsByJobId(ctx.params.jobid, accessToken);

      return new Response(JSON.stringify(submission), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Error fetching submissions:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
