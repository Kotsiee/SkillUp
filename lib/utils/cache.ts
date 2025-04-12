import { getCookies } from "$std/http/cookie.ts";

export async function getCachedUser(req: Request, kv: Deno.Kv) {
  const cookies = getCookies(req.headers);
  const session = cookies["session"];
  // deno-lint-ignore no-explicit-any
  const sessions = (await kv.get(["sessions", session])).value as any;
  const user = await sessions.activeAccount;
  const team = await sessions.activeTeam;

  return {user, team}
}
