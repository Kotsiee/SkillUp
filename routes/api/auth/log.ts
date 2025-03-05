// routes/api/auth/login.ts
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { getSupabaseClient } from "../../../lib/supabase/client.ts";
import { fetchUserByID } from "../../../lib/api/userApi.ts";
import { getCookies } from '$std/http/cookie.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await getSupabaseClient().auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const headers = new Headers();
    setCookie(headers, {
      name: "accessToken",
      value: data.session.access_token,
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      path: "/",
      maxAge: data.session.expires_in,
    });

    setCookie(headers, {
      name: "refreshToken",
      value: data.session.refresh_token,
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      path: "/",
    });

    const user = await fetchUserByID(data.user.id);
    await kv.set(["user", data.session.refresh_token], { user });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers,
    });
  },
  async GET (req) {
    const cookies = getCookies(req.headers)
    const accessToken = cookies["refreshToken"];

    if (!accessToken) return new Response("Missing userId", { status: 400 });

    const user = await kv.get(["user", accessToken]);
    if (!user.value) return new Response("User not found", { status: 404 });

    return new Response(JSON.stringify(user.value), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
