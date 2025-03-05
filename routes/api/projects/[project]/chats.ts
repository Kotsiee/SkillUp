import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchUserChatsByProject } from "../../../../lib/api/chatApi.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const chats = await fetchUserChatsByProject(ctx.params.project)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};