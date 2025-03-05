import { Handlers } from "$fresh/server.ts";
import { fetchUserChatsByID } from "../../../lib/api/chatApi.ts";
import superjson from "https://esm.sh/superjson@2.2.2";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const chats = await fetchUserChatsByID(ctx.params.id)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};