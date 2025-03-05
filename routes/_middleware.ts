import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from '$std/http/cookie.ts';
import { fetchUserByID } from "../lib/api/userApi.ts";
import { getSupabaseClient } from "../lib/supabase/client.ts";

const PROTECTED_ROUTES = ["/messages", "/projects", "/dashboard"]
const kv = await Deno.openKv();

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers)
  const accessToken = cookies["accessToken"]
  const refreshToken = cookies["refreshToken"]

  // ✅ Handle CORS Preflight (`OPTIONS` Request)
  if (req.method === "OPTIONS") {
    const headers = new Headers();
    const origin = req.headers.get("Origin") || "*";

    headers.set("Access-Control-Allow-Origin", origin);
    headers.set(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS",
    );
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-Redirected",
    );
    headers.set("Access-Control-Allow-Credentials", "true");

    return new Response(null, { status: 204, headers });
  }

  // ✅ Continue to next middleware / route
  const origin = req.headers.get("Origin") || "*";
  const resp = await ctx.next();

  // ✅ Clone response before modifying headers (Fixes "Immutable Headers" error)
  const newResp = new Response(resp.body, resp);
  newResp.headers.set("Access-Control-Allow-Origin", origin);
  newResp.headers.set("Access-Control-Allow-Credentials", "true");
  newResp.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Redirected",
  );
  newResp.headers.set(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PUT, DELETE",
  );

  if (refreshToken && !accessToken) {
    const {data, error} = await getSupabaseClient().auth.refreshSession({ refresh_token: refreshToken })

    if (!error) {
      setCookie(newResp.headers, {
        name: "accessToken",
        value: data.session!.access_token,
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
        path: "/",
        maxAge: data.session!.expires_in,
      });

      setCookie(newResp.headers, {
        name: "userID",
        value: data.user!.id,
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
        path: "/",
      });

      const user = await fetchUserByID(data.user!.id);
      await kv.set(["user", data.session!.refresh_token], { user });
    }
    else {
      console.log(error.cause)
    }
  }

  // const localUser = localStorage.getItem("user")
  // if (localUser) {

  //   if (!refreshToken)
  //     localStorage.removeItem("user")

  //   if (refreshToken && !accessToken) {
  //       console.log('refresh')
  //       const {data, error} = await getSupabaseClient().auth.refreshSession({ refresh_token: refreshToken })

  //       if (!error) {
  //         setCookie(newResp.headers, {
  //           name: "accessToken",
  //           value: data.session!.access_token,
  //           secure: true,
  //           httpOnly: true,
  //           sameSite: "Strict",
  //           path: "/",
  //           maxAge: data.session!.expires_in,
  //         });

  //         setCookie(newResp.headers, {
  //           name: "userID",
  //           value: data.user!.id,
  //           secure: true,
  //           httpOnly: true,
  //           sameSite: "Strict",
  //           path: "/",
  //         });

  //         const user = await fetchUserByID(data.user!.id);
  //         localStorage.setItem("user", SuperJSON.stringify(user));
  //       }
  //       else {
  //         console.log(error.cause)
  //       }
  //   }
  // }
  // else if(refreshToken && accessToken && uID) {
  //   const user = await fetchUserByID(uID)
  //   if (user)
  //     localStorage.setItem("user", SuperJSON.stringify(user))
  // }

  if (!refreshToken && PROTECTED_ROUTES.includes(ctx.url.pathname)) {
    return Response.redirect(new URL("/", req.url), 302)
  }

  return newResp;
}