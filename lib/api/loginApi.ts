import { deleteCookie, setCookie } from "$std/http/cookie.ts";
import { getSupabaseClient } from "../supabase/client.ts";
import { fetchUserByID } from "./userApi.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export async function signInWithEmail(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const rememberMe = formData.has("remember");
    
    if (!email || !password) {
        return new Response("Invalid input", { status: 400 });
    }

    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email: formData.get('email')!.toString(),
        password: formData.get('password')!.toString(),
    })

    console.log(data.session)

    if (error || !data.session) {
        console.error("Sign-in error:", error?.message);
        return new Response("Unauthorized: " + error?.message, { status: 401 });
    }

    const user = await fetchUserByID(data.user.id)

    const headers = new Headers();
    setCookie(headers, {
        name: "sb-access-token",
        value: data.session.access_token,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Lax",
        expires: DateTime.utc().plus({ hours: 1 }).toJSDate(), // 1 hour
    });

    setCookie(headers, {
        name: "sb-refresh-token",
        value: data.session.refresh_token,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Lax"
    });

    setCookie(headers, {
        name: "sb-token-expiry",
        value: data.session.expires_at,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Lax"
    });

    headers.set("status", "200")

    return new Response(JSON.stringify(user), { headers });
}

export async function signUpNewUser(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirm-password")?.toString();
    
    if (!email || !password || !confirmPassword)  return new Response("Invalid input", { status: 400 });

    const { data, error } = await getSupabaseClient().auth.signUp({
        email: formData.get('email')!.toString(),
        password: formData.get('password')!.toString(),
    })

    if (error || !data.session) {
        console.error("Sign-in error:", error?.message);
        return new Response("Unauthorized: " + error?.message, { status: 401 });
    }

    const user = await fetchUserByID(data.user!.id)

    return new Response(JSON.stringify(user));
}

export async function getUser(req: Request) {
    const accessToken = getCookie(req, "access_token");
    if (!accessToken) return;
    const { data: user, error } = await getSupabaseClient().auth.getUser(accessToken);
    if (error) return;
    return user;
}

export function getCookie(req: Request, name: string): string | null {
    const cookies = req.headers.get("cookie");
    if (!cookies) return null;
  
    const value = cookies
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  
    return value ? decodeURIComponent(value) : null;
}