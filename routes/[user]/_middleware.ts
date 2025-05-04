// deno-lint-ignore-file no-explicit-any
import { FreshContext } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { fetchTeamById } from '../../lib/newapi/teams/teams.ts';
import { fetchUserById } from '../../lib/newapi/user/user.ts';
import { getCachedUser } from '../../lib/utils/cache.ts';

const PROTECTED_ROUTES = ['/view', '/edit', '/manage'];
const kv = await Deno.openKv();

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers);
  const sessionId = cookies['session'];

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { accessToken, user, team } = await getCachedUser(req, kv);

  if (!accessToken || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session or user' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const resp = await ctx.next();

  const newResp = new Response(resp.body, resp);
  if (newResp.headers.has('X-Redirected')) return newResp;

  const pathname = ctx.url.pathname;

  const headers = new Headers(newResp.headers);
  headers.set('X-Redirected', 'true');

  if (pathname.startsWith(`/${ctx.params.user}`) && user) {
    if (team) {
      const teamInfo = await fetchTeamById(team, accessToken, true);

      if (!teamInfo) {
        headers.set('Location', '/');
        return new Response(null, { status: 302, headers });
      }

      const subPath = pathname.replace(`/${ctx.params.user}`, '');

      if (ctx.params.user === teamInfo?.handle && subPath === '') {
        headers.set('Location', `/${teamInfo?.handle}/view`);
        return new Response(null, { status: 302, headers });
      }

      if (ctx.params.user !== teamInfo?.handle && PROTECTED_ROUTES.includes(subPath)) {
        headers.set('Location', `/${ctx.params.user}`);
        return new Response(null, { status: 302, headers });
      }
    } else {
      const userInfo = await fetchUserById(user, accessToken, true);

      if (!userInfo) {
        headers.set('Location', '/');
        return new Response(null, { status: 302, headers });
      }

      const subPath = pathname.replace(`/${ctx.params.user}`, '');

      if (ctx.params.user === userInfo.username && subPath === '') {
        headers.set('Location', `/${userInfo.username}/view`);
        return new Response(null, { status: 302, headers });
      }

      if (ctx.params.user !== userInfo.username && PROTECTED_ROUTES.includes(subPath)) {
        headers.set('Location', `/${ctx.params.user}`);
        return new Response(null, { status: 302, headers });
      }
    }
  }

  return newResp;
}
