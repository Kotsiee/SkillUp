import { FreshContext, Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchFiles, uploadFile } from "../../../lib/api/filesApi.ts";
import { User } from "../../../lib/types/index.ts";
import { getSupabaseClient } from "../../../lib/supabase/client.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, ctx: FreshContext) {
        const cookies = getCookies(req.headers)
        const accessToken = cookies["refreshToken"];

        if (!accessToken) return new Response("Missing userId", { status: 400 });
        const user = await kv.get(["user", accessToken]);

        const files = await fetchFiles((user.value as any).user as User, ctx.url.searchParams.get("types"))

        return new Response(superjson.stringify(files), {
            headers: { "Content-Type": "application/json" },
        });
    },

    async POST(req, ctx) {
        const cookies = getCookies(req.headers)
        const accessToken = cookies["accessToken"];

        const file = await req.formData()
        const newFile = JSON.parse(file.get("file")?.toString() || "")

        await uploadFile(newFile, accessToken)

        return new Response("mission complete", {
            headers: { "Content-Type": "application/json" },
        });
    },
};