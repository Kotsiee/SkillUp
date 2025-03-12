import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { fetchUserChatsByID } from "../../../lib/api/chatApi.ts";
import superjson from "https://esm.sh/superjson@2.2.2";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, _ctx) {
        const cookies = getCookies(req.headers)
        const accessToken = cookies["refreshToken"];
        const user = await kv.get(["user", accessToken]);

        if (!user || !user.value)
        return new Response(null);

        const chats = await fetchUserChatsByID((user.value as any) .user.id)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};