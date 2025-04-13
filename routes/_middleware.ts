// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.unstable" />
import { FreshContext } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { getSupabaseClient } from '../lib/supabase/client.ts';

// const PROTECTED_ROUTES = ["/messages", "/projects", "/dashboard"]
const kv = await Deno.openKv();

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers);
  const session = cookies['session'];

  if (req.method === 'OPTIONS') {
    const headers = new Headers();
    const origin = req.headers.get('Origin') || '*';

    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, X-Redirected, Accept, Cache-Control, Last-Event-ID'
    );
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Max-Age', '86400');

    return new Response(null, { status: 204, headers });
  }

  const origin = req.headers.get('Origin') || '*';
  const resp = await ctx.next();

  const newResp = new Response(resp.body, resp);
  newResp.headers.set('Access-Control-Allow-Origin', origin);
  newResp.headers.set('Access-Control-Allow-Credentials', 'true');
  newResp.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Redirected, Accept, X-Requested-With, Cache-Control, Last-Event-ID'
  );

  newResp.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PUT, DELETE');

  if (session) {
    const sessionData = (await kv.get(['sessions', session])).value as any;

    if (sessionData) {
      const tokenExpiresIn = 3600;
      const now = Date.now();

      const currentUserIndex = sessionData.accounts.findIndex(
        (acc: any) => acc.id === sessionData.activeAccount
      );
      const currentUser = sessionData.accounts[currentUserIndex];

      if (currentUser)
        if (
          !currentUser.accessToken ||
          (currentUser.tokenUpdatedAt && now - currentUser.tokenUpdatedAt > tokenExpiresIn)
        ) {
          console.log('🔄 Refreshing token...');

          try {
            const { data, error } = await getSupabaseClient().auth.refreshSession({
              refresh_token: currentUser.refreshToken,
            });

            if (!error && data.session) {
              sessionData.accounts[currentUserIndex] = {
                ...currentUser,
                accessToken: data.session.access_token,
                tokenUpdatedAt: now,
              };

              await kv.set(['sessions', session], sessionData);
            } else {
              delete sessionData.accounts[currentUserIndex].refreshToken;
              await kv.set(['sessions', session], sessionData);
            }
          } catch (err) {
            console.error('⚠️ Unexpected error during refresh:', err);
          }
        }
    }
  }

  // if (refreshToken && !accessToken) {
  //   const cachedSession = await kv.get(["user", refreshToken]) as any;

  //   if (cachedSession && cachedSession.session) {
  //     console.log("Using cached session from OpenKV.");
  //     setCookie(newResp.headers, {
  //       name: "accessToken",
  //       value: cachedSession.session.access_token,
  //       secure: true,
  //       httpOnly: true,
  //       sameSite: "Strict",
  //       path: "/",
  //       maxAge: cachedSession.session.expires_in,
  //     });

  //     setCookie(newResp.headers, {
  //       name: "userID",
  //       value: cachedSession.user?.user?.id ?? "", // Ensure safety when accessing user ID
  //       secure: true,
  //       httpOnly: true,
  //       sameSite: "Strict",
  //       path: "/",
  //     });

  //   } else {
  //     console.log("No cached session found, querying getSupabaseClient()...");
  //     const { data, error } = await getSupabaseClient().auth.refreshSession({ refresh_token: refreshToken });

  //     if (!error && data.session) {
  //       setCookie(newResp.headers, {
  //         name: "accessToken",
  //         value: data.session.access_token,
  //         secure: true,
  //         httpOnly: true,
  //         sameSite: "Strict",
  //         path: "/",
  //         maxAge: data.session.expires_in,
  //       });

  //       setCookie(newResp.headers, {
  //         name: "userID",
  //         value: data.user?.id ?? "", // Safety check for user ID
  //         secure: true,
  //         httpOnly: true,
  //         sameSite: "Strict",
  //         path: "/",
  //       });

  //       const user = await fetchUserByID(data.user!.id);
  //       await kv.set(["user", refreshToken], { user, session: data.session });
  //     } else {
  //       console.log('Error refreshing session:', error?.message);
  //     }
  //   }

  // }

  // if (!refreshToken && PROTECTED_ROUTES.includes(ctx.url.pathname)) {
  //   return Response.redirect(new URL("/", req.url), 302)
  // }

  return newResp;
}
