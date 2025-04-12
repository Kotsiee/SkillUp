import { FreshContext, Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchFiles, uploadFile } from "../../../lib/api/files/file.ts";
import { getCachedUser } from "../../../lib/utils/cache.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, ctx: FreshContext) {
        const {user} = await getCachedUser(req, kv)
        if (!user) return new Response("Missing userId", { status: 400 });
        const files = await fetchFiles(user, ctx.url.searchParams.get("types"))

        return new Response(superjson.stringify(files), {
            headers: { "Content-Type": "application/json" },
        });
    },

    async POST(req, _ctx) {
        const cookies = getCookies(req.headers);
        const session = cookies["session"];
        // deno-lint-ignore no-explicit-any
        const sessions = (await kv.get(["sessions", session])).value as any;
        const accessToken = sessions.accounts[0].accessToken
        console.log("access token:", accessToken)

        const file = await req.formData()
        const newFile = JSON.parse(file.get("file")?.toString() || "")

        const files = await uploadFile(newFile, accessToken)

        return new Response(superjson.stringify(files), {
            headers: { "Content-Type": "text/plain" },
        });
    },
};