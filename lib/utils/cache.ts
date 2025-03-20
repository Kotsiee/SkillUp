import { getCookies } from "$std/http/cookie.ts";

export async function getCachedUser(req: Request, kv: Deno.Kv) {
  const cookies = getCookies(req.headers);
  const accessToken = cookies["refreshToken"];
  const user = (await kv.get(["user", accessToken])).value;

  return user
}
