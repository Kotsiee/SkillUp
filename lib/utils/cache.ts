import { getCookies } from '$std/http/cookie.ts';

export async function getCachedUser(req: Request, kv: Deno.Kv) {
  const cookies = getCookies(req.headers);
  const session = cookies['session'];
  if (!session) return { user: null, team: null, accessToken: null };

  const sessions = (await kv.get(['sessions', session])).value as any;

  if (!sessions || !sessions.accounts) {
    return { user: null, team: null, accessToken: null };
  }

  const user = sessions.activeAccount || null;
  const team = sessions.activeTeam || null;
  const account = sessions.accounts.find((acc: any) => acc.id === sessions.activeAccount);
  const accessToken = account?.accessToken || null;

  return { user, team, accessToken };
}
