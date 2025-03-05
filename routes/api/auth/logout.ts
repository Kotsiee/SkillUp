// routes/api/auth/login.ts
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { SuperJSON } from "https://esm.sh/superjson@2.2.2";
import { fetchChatByID } from "../../../lib/api/chatApi.ts";
import { getSupabaseClient } from "../../../lib/supabase/client.ts";
import { fetchUserByID } from "../../../lib/api/userApi.ts";


//log out
export const handler: Handlers = {
  async POST(req) {
    // Get user from Supabase
    await getSupabaseClient().auth.signOut()

    // Return tokens in HTTP-only cookies (common approach)
    const headers = new Headers();

    headers.append("Set-Cookie", "accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
    headers.append("Set-Cookie", "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
    headers.append("Set-Cookie", "userID=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")

    localStorage.removeItem("user");
    return new Response(JSON.stringify({ message: "Logged off" }), {headers});
  },
};
