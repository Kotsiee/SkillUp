// deno-lint-ignore-file no-explicit-any
import { FreshContext } from "$fresh/server.ts";
import { fetchTeamByID } from "../../lib/api/teams/teams.ts";
import { fetchUserByID } from "../../lib/api/user/user.ts";
import { getCachedUser } from "../../lib/utils/cache.ts";

const PROTECTED_ROUTES = ["/view", "/edit", "/manage"];
const kv = await Deno.openKv();

export async function handler(req: Request, ctx: FreshContext) {
  const { user, team } = await getCachedUser(req, kv);
  const resp = await ctx.next();

  const newResp = new Response(resp.body, resp);
  if (newResp.headers.has("X-Redirected")) return newResp;

  const pathname = ctx.url.pathname;

  const headers = new Headers(newResp.headers);
  headers.set("X-Redirected", "true");

  // 🧠 USER PROFILE LOGIC
  if (pathname.startsWith(`/${ctx.params.user}`) && user) {
    if (team) {
      const teamInfo = await fetchTeamByID(team, true);

      if (!teamInfo) {
        headers.set("Location", "/");
        return new Response(null, { status: 302, headers });
      }

      const subPath = pathname.replace(`/${ctx.params.user}`, "");

      if (ctx.params.user === teamInfo?.handle && subPath === "") {
        headers.set("Location", `/${teamInfo?.handle}/view`);
        return new Response(null, { status: 302, headers });
      }

      if (ctx.params.user !== teamInfo?.handle && PROTECTED_ROUTES.includes(subPath)) {
        headers.set("Location", `/${teamInfo?.handle}/view`);
        return new Response(null, { status: 302, headers });
      }
    }
    else {
      const userInfo = await fetchUserByID(user);

      if (!userInfo) {
        headers.set("Location", "/");
        return new Response(null, { status: 302, headers });
      }
  
      const subPath = pathname.replace(`/${ctx.params.user}`, "");
  
      if (ctx.params.user === userInfo.username && subPath === "") {
        headers.set("Location", `/${userInfo.username}/view`);
        return new Response(null, { status: 302, headers });
      }
  
      if (ctx.params.user !== userInfo.username && PROTECTED_ROUTES.includes(subPath)) {
        headers.set("Location", `/${userInfo.username}/view`);
        return new Response(null, { status: 302, headers });
      }
    }
  }

  return newResp;
}
