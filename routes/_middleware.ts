// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.unstable" />
import { FreshContext } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';
import { getSupabaseClient } from '../lib/supabase/client.ts';

const protectedPaths = ['/dashboard', '/messages', '/projects', '/teams', '/files'];

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);
  const kv = await Deno.openKv();
  const cookies = getCookies(req.headers);
  const sessionId = cookies['session'];
  const origin = req.headers.get('Origin') || '*';

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  let sessionData: any = null;
  if (sessionId) {
    sessionData = (await kv.get(['sessions', sessionId])).value as any;
  }

  // Redirect unauthenticated users trying to access protected routes
  if (protectedPaths.some(path => url.pathname.startsWith(path))) {
    const hasValidUser = sessionData?.accounts?.some(
      (acc: any) => acc.id === sessionData.activeAccount
    );

    if (!hasValidUser) {
      return redirect('/account/login');
    }
  }

  // Handle root route redirection
  if (url.pathname === '/' && sessionData) {
    if (isLoggedIn(sessionData)) {
      return redirect('/dashboard');
    }
  }

  // Refresh Token Logic
  if (sessionId && sessionData) {
    await handleTokenRefresh(sessionId, sessionData, kv);
  }

  // Continue request
  const resp = await ctx.next();

  // Add CORS headers
  const newResp = new Response(resp.body, resp);
  newResp.headers.set('Access-Control-Allow-Origin', origin);
  newResp.headers.set('Access-Control-Allow-Credentials', 'true');
  newResp.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Redirected, Accept, Cache-Control, Last-Event-ID'
  );
  newResp.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PUT, DELETE');

  return newResp;
}

// --- Helper Functions ---

function isLoggedIn(sessionData: any): boolean {
  return sessionData?.accounts?.some((acc: any) => acc.id === sessionData.activeAccount);
}

function redirect(location: string) {
  return new Response(null, {
    status: 307,
    headers: {
      Location: location,
    },
  });
}

function corsResponse() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Redirected, Accept, Cache-Control, Last-Event-ID'
  );
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Max-Age', '86400');
  return new Response(null, { status: 204, headers });
}

async function handleTokenRefresh(sessionId: string, sessionData: any, kv: Deno.Kv) {
  try {
    const tokenExpiresIn = 3600; // seconds
    const now = Date.now();

    const currentUserIndex = sessionData.accounts.findIndex(
      (acc: any) => acc.id === sessionData.activeAccount
    );
    if (currentUserIndex === -1) return;

    const currentUser = sessionData.accounts[currentUserIndex];

    const shouldRefresh =
      !currentUser.accessToken ||
      (currentUser.tokenUpdated && now - currentUser.tokenUpdated > tokenExpiresIn * 1000);

    if (!shouldRefresh || !currentUser.refreshToken) return;

    const sessionLockKey = ['session_lock', sessionId];
    const locked = (await kv.get(sessionLockKey)).value;

    if (locked) {
      console.log('Refresh already in progress. Skipping.');
      return;
    }

    // Set lock
    await kv.set(sessionLockKey, true, { expireIn: 10000 }); // 10s

    // Try refreshing
    const { data, error } = await getSupabaseClient().auth.refreshSession({
      refresh_token: currentUser.refreshToken,
    });

    if (!error && data.session) {
      sessionData.accounts[currentUserIndex] = {
        id: currentUser.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        tokenUpdated: now,
      };
      await kv.set(['sessions', sessionId], sessionData);
      console.log('Access token refreshed successfully.');
    } else {
      console.error('Failed to refresh token:', error?.message);
    }

    // Remove lock
    await kv.delete(sessionLockKey);
  } catch (error) {
    console.error('Unexpected error during token refresh:', error);
    // Always remove lock even if errors happen
    await kv.delete(['session_lock', sessionId]);
  }
}
