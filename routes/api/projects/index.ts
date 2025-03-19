import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchProjectRoleByUser } from "../../../lib/api/projectRolesApi.ts";
import { getCookies } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, _ctx) {
    const cookies = getCookies(req.headers);
    const refreshToken = cookies["refreshToken"];

        if (!refreshToken) return new Response("Missing userId", { status: 400 });
        const user = await kv.get(["user", refreshToken]);


        if (!user)
        return new Response(null);

        const chats = await fetchProjectRoleByUser((user.value as any).user.id)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};