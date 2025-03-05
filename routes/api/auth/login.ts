// routes/api/auth/login.ts
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { SuperJSON } from "https://esm.sh/superjson@2.2.2";
import { fetchChatByID } from "../../../lib/api/chatApi.ts";
import { getSupabaseClient } from "../../../lib/supabase/client.ts";
import { fetchUserByID } from "../../../lib/api/userApi.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const form = await req.formData();

      const email = form.get("email")?.toString();
      const password = form.get("password")?.toString();

      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get user from Supabase
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

      // Return tokens in HTTP-only cookies (common approach)
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

      setCookie(headers, {
        name: "userID",
        value: data.user.id,
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
        path: "/",
      });

      const user = await fetchUserByID(data.user.id);
      localStorage.setItem("user", SuperJSON.stringify(user));

      return new Response(JSON.stringify(user), {
        status: 200,
        headers,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "errrrr" }), {
        status: 500,
      });
    }
  },
};
