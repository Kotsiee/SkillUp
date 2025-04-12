// GET all chats, POST new chat
// deno-lint-ignore-file no-explicit-any
import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { getCachedUser } from "../../../lib/utils/cache.ts";
import { fetchUserChatsByID } from "../../../lib/api/messages/chats.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, _ctx) {
        const {user} = await getCachedUser(req, kv)
        if (!user) return new Response(null);

        const chats = await fetchUserChatsByID(user)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};