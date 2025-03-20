// deno-lint-ignore-file no-explicit-any
import { FreshContext } from "$fresh/server.ts";;
import { getCookies } from "$std/http/cookie.ts";
import { User } from "../../lib/types/index.ts";

const PROTECTED_ROUTES = ["/view", "/edit", "/manage"];
const kv = await Deno.openKv();

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers);
  const accessToken = cookies["refreshToken"];

  const resp = await ctx.next();

  const newResp = new Response(resp.body, resp);
  if (newResp.headers.has("X-Redirected")) {
    return newResp;
  }

  const user = await kv.get(["user", accessToken]);

  if (user.value) {
    const userInfo = (user.value as any).user as User;
    if (
      ctx.url.pathname === `/${ctx.params.user}` &&
      userInfo.username === ctx.params.user
    ) {
      newResp.headers.set("X-Redirected", "true");
      newResp.headers.set("Location", `/${ctx.params.user}/view`);
      const headers = newResp.headers;

      return new Response(null, { status: 302, headers });
    } else if (userInfo.username !== ctx.params.user && PROTECTED_ROUTES.includes(ctx.url.pathname.replace(`/${ctx.params.user}`, ""))) {
      newResp.headers.set("X-Redirected", "true");
      newResp.headers.set("Location", `/${ctx.params.user}`);
      const headers = newResp.headers;

      return new Response(null, { status: 302, headers });
    }
  }

  return newResp;
}
